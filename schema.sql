-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Public profiles for all users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  role text check (role in ('patient', 'doctor', 'admin')) not null default 'patient',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for users
alter table public.users enable row level security;
create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- DOCTORS TABLE
create table public.doctors (
  id uuid references public.users(id) on delete cascade primary key,
  specialization text,
  qualifications text,
  experience_years integer,
  consultation_fee decimal,
  bio text,
  clinic_address text,
  rating decimal default 0,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for doctors
alter table public.doctors enable row level security;
create policy "Doctors are viewable by everyone" on public.doctors for select using (true);
create policy "Doctors can update their own profile" on public.doctors for update using (auth.uid() = id);
create policy "Doctors can insert their own profile" on public.doctors for insert with check (auth.uid() = id);

-- PATIENTS TABLE
create table public.patients (
  id uuid references public.users(id) on delete cascade primary key,
  date_of_birth date,
  blood_group text,
  medical_history text,
  allergies text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for patients
alter table public.patients enable row level security;
create policy "Patients can view their own profile" on public.patients for select using (auth.uid() = id);
create policy "Doctors can view patient profiles for appointments" on public.patients for select using (
  exists (
    select 1 from public.appointments
    where appointments.patient_id = patients.id
    and appointments.doctor_id = auth.uid()
  )
);
create policy "Patients can update their own profile" on public.patients for update using (auth.uid() = id);
create policy "Patients can insert their own profile" on public.patients for insert with check (auth.uid() = id);

-- DOCTOR AVAILABILITY
create table public.doctor_availability (
  id uuid default uuid_generate_v4() primary key,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  day_of_week integer check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  slot_duration integer default 30, -- in minutes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for availability
alter table public.doctor_availability enable row level security;
create policy "Availability is viewable by everyone" on public.doctor_availability for select using (true);
create policy "Doctors can manage their availability" on public.doctor_availability for all using (auth.uid() = doctor_id);

-- APPOINTMENTS
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  appointment_date date not null,
  appointment_time time not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  reason text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for appointments
alter table public.appointments enable row level security;
create policy "Patients can view their own appointments" on public.appointments for select using (auth.uid() = patient_id);
create policy "Doctors can view their own appointments" on public.appointments for select using (auth.uid() = doctor_id);
create policy "Patients can create appointments" on public.appointments for insert with check (auth.uid() = patient_id);
create policy "Doctors can update appointment status" on public.appointments for update using (auth.uid() = doctor_id);
create policy "Patients can cancel their appointments" on public.appointments for update using (auth.uid() = patient_id);

-- REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  patient_id uuid references public.patients(id) on delete cascade not null,
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for reviews
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Patients can create reviews for their appointments" on public.reviews for insert with check (auth.uid() = patient_id);

-- PRESCRIPTIONS
create table public.prescriptions (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  medicines jsonb, -- Array of objects { name, dosage, frequency, duration }
  instructions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for prescriptions
alter table public.prescriptions enable row level security;
create policy "Patients can view their prescriptions" on public.prescriptions for select using (
  exists (
    select 1 from public.appointments
    where appointments.id = prescriptions.appointment_id
    and appointments.patient_id = auth.uid()
  )
);
create policy "Doctors can manage prescriptions" on public.prescriptions for all using (
  exists (
    select 1 from public.appointments
    where appointments.id = prescriptions.appointment_id
    and appointments.doctor_id = auth.uid()
  )
);

-- TRIGGER to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
