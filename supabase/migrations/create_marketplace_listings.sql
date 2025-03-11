
create type work_category as enum ('tax_prep', 'bookkeeping', 'audit', 'advisory');

create table marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  description text not null,
  category work_category not null,
  lgr_amount integer not null check (lgr_amount > 0),
  deadline date not null check (deadline > now()),
  status text not null default 'open',
  creator_id uuid references auth.users(id),
  acceptor_id uuid references auth.users(id),
  completed_at timestamp with time zone
);

-- Add RLS policies
alter table marketplace_listings enable row level security;

-- Anyone can view listings
create policy "Anyone can view listings"
  on marketplace_listings for select
  using (true);

-- Only authenticated users can insert
create policy "Authenticated users can create listings"
  on marketplace_listings for insert
  to authenticated
  with check (creator_id = auth.uid());

-- Creators can update their own listings
create policy "Users can update own listings"
  on marketplace_listings for update
  using (creator_id = auth.uid());
