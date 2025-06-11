-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    daily_calorie_goal INTEGER DEFAULT 2000,
    daily_protein_goal INTEGER DEFAULT 150,
    daily_carbs_goal INTEGER DEFAULT 250,
    daily_fats_goal INTEGER DEFAULT 70,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    age INTEGER,
    gender TEXT,
    activity_level TEXT,
    dietary_preferences TEXT[],
    allergies TEXT[],
    CONSTRAINT valid_calorie_goal CHECK (daily_calorie_goal > 0),
    CONSTRAINT valid_protein_goal CHECK (daily_protein_goal > 0),
    CONSTRAINT valid_carbs_goal CHECK (daily_carbs_goal > 0),
    CONSTRAINT valid_fats_goal CHECK (daily_fats_goal > 0)
);

-- Create meals table
CREATE TABLE meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    image_url TEXT,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    proteins NUMERIC(5,2) NOT NULL,
    carbs NUMERIC(5,2) NOT NULL,
    fats NUMERIC(5,2) NOT NULL,
    meal_type meal_type NOT NULL,
    serving_size NUMERIC(5,2),
    serving_unit TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT false,
    CONSTRAINT valid_calories CHECK (calories > 0),
    CONSTRAINT valid_proteins CHECK (proteins >= 0),
    CONSTRAINT valid_carbs CHECK (carbs >= 0),
    CONSTRAINT valid_fats CHECK (fats >= 0)
);

-- Create meal_tracking table
CREATE TABLE meal_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    meal_id UUID REFERENCES meals NOT NULL,
    date DATE NOT NULL,
    meal_time TIME NOT NULL,
    quantity NUMERIC(5,2) DEFAULT 1,
    notes TEXT,
    CONSTRAINT valid_quantity CHECK (quantity > 0)
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    plan_type subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    auto_renew BOOLEAN DEFAULT true,
    last_payment_date TIMESTAMP WITH TIME ZONE,
    next_payment_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_created_at ON meals(created_at);
CREATE INDEX idx_meal_tracking_user_id ON meal_tracking(user_id);
CREATE INDEX idx_meal_tracking_date ON meal_tracking(date);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view their own meals"
    ON meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
    ON meals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
    ON meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
    ON meals FOR DELETE
    USING (auth.uid() = user_id);

-- Meal tracking policies
CREATE POLICY "Users can view their own meal tracking"
    ON meal_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal tracking"
    ON meal_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal tracking"
    ON meal_tracking FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal tracking"
    ON meal_tracking FOR DELETE
    USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 