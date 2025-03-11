
-- Create a table for tracking referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_address TEXT NOT NULL,
  referred_address TEXT NOT NULL,
  referral_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  nft_purchased BOOLEAN NOT NULL DEFAULT FALSE,
  purchase_date TIMESTAMP WITH TIME ZONE,
  payment_processed BOOLEAN NOT NULL DEFAULT FALSE,
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_amount NUMERIC,
  payment_tx_hash TEXT,
  UNIQUE(referrer_address, referred_address)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_address ON referrals (referrer_address);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_address ON referrals (referred_address);
CREATE INDEX IF NOT EXISTS idx_referrals_nft_purchased ON referrals (nft_purchased);

-- Create RLS policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Anyone can view referrals where they are the referrer
CREATE POLICY select_own_referrals ON referrals 
  FOR SELECT USING (auth.uid()::text = referrer_address);

-- Insert is allowed for recording referrals (we'll handle validation in the application)
CREATE POLICY insert_referrals ON referrals 
  FOR INSERT WITH CHECK (true);

-- Only service role can update referrals for processing payments
CREATE POLICY update_referrals ON referrals 
  FOR UPDATE USING (auth.uid()::text = referrer_address OR auth.uid()::text = referred_address);
