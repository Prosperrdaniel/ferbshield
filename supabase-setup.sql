-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Profiles table (stores role + user info)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. Users can only read/update their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- 4. Allow insert during registration (service role handles this via server action)
create policy "Allow insert on registration"
  on profiles for insert
  with check (auth.uid() = id);

-- 5. (Optional) To manually make a user an admin, run:
-- update profiles set role = 'admin' where email = 'admin@example.com';
