-- ============================================================
-- PANADERÍA MARGHERITA - Schema de Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Usuarios
create table if not exists users (
  id        bigint primary key,
  name      text,
  username  text unique,
  password  text,
  role      text,
  modules   jsonb,
  active    boolean default true,
  avatar    text,
  "createdAt" text
);

-- Ventas
create table if not exists sales (
  id      bigint primary key,
  amount  numeric,
  method  text,
  date    text,
  time    text,
  items   text,
  "userId" bigint
);

-- Pedidos mostrador
create table if not exists orders (
  id      bigint primary key,
  client  text,
  product text,
  date    text,
  time    text,
  total   numeric default 0,
  paid    numeric default 0,
  note    text,
  status  text default 'pendiente'
);

-- Clientes reparto
create table if not exists clients (
  id              bigint primary key,
  name            text,
  type            text,
  address         text,
  phone           text,
  balance         numeric default 0,
  active          boolean default true,
  "deliveryDays"  jsonb,
  products        text
);

-- Entregas / reparto
create table if not exists deliveries (
  id           bigint primary key,
  "clientId"   bigint references clients(id),
  products     text,
  date         text,
  amount       numeric default 0,
  "paidAmount" numeric default 0,
  note         text
);

-- Gastos
create table if not exists expenses (
  id        bigint primary key,
  concept   text,
  category  text,
  amount    numeric,
  date      text,
  note      text,
  "payMethod" text default 'efectivo'
);

-- Personal
create table if not exists staff (
  id          bigint primary key,
  name        text,
  role        text,
  salary      numeric,
  type        text,
  "startDate" text,
  active      boolean default true
);

-- Turnos de caja
create table if not exists cash_sessions (
  id           bigint primary key,
  "openedBy"   text,
  "openedAt"   text,
  "closedAt"   text,
  opening      numeric,
  closing      numeric,
  "cashSales"  numeric,
  status       text
);

-- Pedidos especiales reparto
create table if not exists reparto_orders (
  id         bigint primary key,
  "clientId" bigint references clients(id),
  date       text,
  note       text,
  done       boolean default false
);

-- Categorías personalizadas de gastos
create table if not exists custom_cats (
  id    text primary key,
  name  text,
  icon  text,
  color text,
  tipo  text
);

-- Pagos de nómina
create table if not exists payroll_payments (
  id        bigint primary key,
  "staffId" text,
  amount    numeric,
  date      text,
  note      text,
  week      text
);

-- Deshabilitar RLS para uso simple (habilitar y configurar políticas si querés seguridad extra)
alter table users             disable row level security;
alter table sales             disable row level security;
alter table orders            disable row level security;
alter table clients           disable row level security;
alter table deliveries        disable row level security;
alter table expenses          disable row level security;
alter table staff             disable row level security;
alter table cash_sessions     disable row level security;
alter table reparto_orders    disable row level security;
alter table custom_cats       disable row level security;
alter table payroll_payments  disable row level security;
