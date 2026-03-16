--
-- PostgreSQL database dump
--

\restrict LNsvMa4GlMjRNjj0RErtgRVzvnPtKj0nzq9CicQq2kclPTM2hFg6NiR3zJMrAhu

-- Dumped from database version 17.5
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.bill_of_materials DROP CONSTRAINT bom_catalog_item_fkey;
ALTER TABLE ONLY public.bill_of_materials DROP CONSTRAINT "bill_of_materials_fencingServiceId_fkey";
ALTER TABLE ONLY public."SupportTicket" DROP CONSTRAINT "SupportTicket_userId_fkey";
ALTER TABLE ONLY public."SupportTicket" DROP CONSTRAINT "SupportTicket_quoteId_fkey";
ALTER TABLE ONLY public."SupportTicket" DROP CONSTRAINT "SupportTicket_customerId_fkey";
ALTER TABLE ONLY public."PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";
ALTER TABLE ONLY public."PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";
ALTER TABLE ONLY public."PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_catalogItemId_fkey";
ALTER TABLE ONLY public."Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";
ALTER TABLE ONLY public."Job" DROP CONSTRAINT "Job_teamMemberId_fkey";
ALTER TABLE ONLY public."Job" DROP CONSTRAINT "Job_invoiceId_fkey";
ALTER TABLE ONLY public."JobPhoto" DROP CONSTRAINT "JobPhoto_jobId_fkey";
ALTER TABLE ONLY public."Invoice" DROP CONSTRAINT "Invoice_quoteId_fkey";
ALTER TABLE ONLY public."Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";
ALTER TABLE ONLY public."FenceQuote" DROP CONSTRAINT "FenceQuote_fencingServiceId_fkey";
ALTER TABLE ONLY public."FenceQuote" DROP CONSTRAINT "FenceQuote_customerId_fkey";
ALTER TABLE ONLY public."Expense" DROP CONSTRAINT "Expense_jobId_fkey";
ALTER TABLE ONLY public."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";
DROP INDEX public."bill_of_materials_fencingServiceId_idx";
DROP INDEX public."bill_of_materials_catalogItemId_idx";
DROP INDEX public."User_email_key";
DROP INDEX public."User_email_idx";
DROP INDEX public."User_clerkId_key";
DROP INDEX public."User_clerkId_idx";
DROP INDEX public."TeamMember_email_key";
DROP INDEX public."SupportTicket_userId_idx";
DROP INDEX public."SupportTicket_status_idx";
DROP INDEX public."SupportTicket_quoteId_idx";
DROP INDEX public."SupportTicket_customerId_idx";
DROP INDEX public."PurchaseOrder_supplierId_idx";
DROP INDEX public."PurchaseOrder_status_idx";
DROP INDEX public."PurchaseOrderItem_purchaseOrderId_idx";
DROP INDEX public."PurchaseOrderItem_catalogItemId_idx";
DROP INDEX public."Payment_status_idx";
DROP INDEX public."Payment_invoiceId_idx";
DROP INDEX public."Notification_read_idx";
DROP INDEX public."Notification_createdAt_idx";
DROP INDEX public."Job_teamMemberId_idx";
DROP INDEX public."Job_status_idx";
DROP INDEX public."Job_scheduledDate_idx";
DROP INDEX public."Job_invoiceId_key";
DROP INDEX public."JobPhoto_jobId_idx";
DROP INDEX public."Invoice_status_idx";
DROP INDEX public."Invoice_quoteId_key";
DROP INDEX public."Invoice_issuedAt_idx";
DROP INDEX public."Invoice_invoiceNumber_key";
DROP INDEX public."Invoice_invoiceNumber_idx";
DROP INDEX public."Invoice_customerId_idx";
DROP INDEX public."FencingService_isActive_idx";
DROP INDEX public."FenceQuote_status_idx";
DROP INDEX public."FenceQuote_pipelineStage_idx";
DROP INDEX public."FenceQuote_customerId_idx";
DROP INDEX public."FenceQuote_createdAt_idx";
DROP INDEX public."Expense_jobId_idx";
DROP INDEX public."Expense_date_idx";
DROP INDEX public."Expense_category_idx";
DROP INDEX public."Customer_name_idx";
DROP INDEX public."AuditLog_userId_idx";
DROP INDEX public."AuditLog_entityId_idx";
DROP INDEX public."AuditLog_createdAt_idx";
DROP INDEX public."AuditLog_action_idx";
ALTER TABLE ONLY public.tax_configs DROP CONSTRAINT tax_configs_pkey;
ALTER TABLE ONLY public.catalog_items DROP CONSTRAINT catalog_items_pkey;
ALTER TABLE ONLY public.business_configs DROP CONSTRAINT business_configs_pkey;
ALTER TABLE ONLY public.bill_of_materials DROP CONSTRAINT bill_of_materials_pkey;
ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY public."TeamMember" DROP CONSTRAINT "TeamMember_pkey";
ALTER TABLE ONLY public."SupportTicket" DROP CONSTRAINT "SupportTicket_pkey";
ALTER TABLE ONLY public."Supplier" DROP CONSTRAINT "Supplier_pkey";
ALTER TABLE ONLY public."PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey";
ALTER TABLE ONLY public."PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_pkey";
ALTER TABLE ONLY public."Payment" DROP CONSTRAINT "Payment_pkey";
ALTER TABLE ONLY public."Notification" DROP CONSTRAINT "Notification_pkey";
ALTER TABLE ONLY public."Job" DROP CONSTRAINT "Job_pkey";
ALTER TABLE ONLY public."JobPhoto" DROP CONSTRAINT "JobPhoto_pkey";
ALTER TABLE ONLY public."Invoice" DROP CONSTRAINT "Invoice_pkey";
ALTER TABLE ONLY public."FencingService" DROP CONSTRAINT "FencingService_pkey";
ALTER TABLE ONLY public."FencingAddon" DROP CONSTRAINT "FencingAddon_pkey";
ALTER TABLE ONLY public."FenceQuote" DROP CONSTRAINT "FenceQuote_pkey";
ALTER TABLE ONLY public."Expense" DROP CONSTRAINT "Expense_pkey";
ALTER TABLE ONLY public."Customer" DROP CONSTRAINT "Customer_pkey";
ALTER TABLE ONLY public."AuditLog" DROP CONSTRAINT "AuditLog_pkey";
DROP TABLE public.tax_configs;
DROP TABLE public.catalog_items;
DROP TABLE public.business_configs;
DROP TABLE public.bill_of_materials;
DROP TABLE public."User";
DROP TABLE public."TeamMember";
DROP TABLE public."SupportTicket";
DROP TABLE public."Supplier";
DROP TABLE public."PurchaseOrderItem";
DROP TABLE public."PurchaseOrder";
DROP TABLE public."Payment";
DROP TABLE public."Notification";
DROP TABLE public."JobPhoto";
DROP TABLE public."Job";
DROP TABLE public."Invoice";
DROP TABLE public."FencingService";
DROP TABLE public."FencingAddon";
DROP TABLE public."FenceQuote";
DROP TABLE public."Expense";
DROP TABLE public."Customer";
DROP TABLE public."AuditLog";
DROP EXTENSION pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    "performedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata jsonb,
    "userId" text
);


ALTER TABLE public."AuditLog" OWNER TO security360_user;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text
);


ALTER TABLE public."Customer" OWNER TO security360_user;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "jobId" text
);


ALTER TABLE public."Expense" OWNER TO security360_user;

--
-- Name: FenceQuote; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."FenceQuote" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "fencingServiceId" text NOT NULL,
    "lengthMeters" numeric(10,2) NOT NULL,
    "heightMeters" numeric(10,2) NOT NULL,
    terrain text NOT NULL,
    "addOnIds" text[],
    subtotal numeric(10,2) NOT NULL,
    vat numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "pipelineStage" text DEFAULT 'LEAD'::text NOT NULL,
    "signatureData" text,
    "signedAt" timestamp(3) without time zone
);


ALTER TABLE public."FenceQuote" OWNER TO security360_user;

--
-- Name: FencingAddon; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."FencingAddon" (
    id text NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "pricingType" text NOT NULL
);


ALTER TABLE public."FencingAddon" OWNER TO security360_user;

--
-- Name: FencingService; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."FencingService" (
    id text NOT NULL,
    name text NOT NULL,
    "pricePerMeter" numeric(10,2) NOT NULL,
    "installationFee" numeric(10,2) NOT NULL,
    "supportsElectric" boolean DEFAULT false NOT NULL,
    "supportsRazor" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text
);


ALTER TABLE public."FencingService" OWNER TO security360_user;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "customerId" text NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    vat numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "quoteId" text,
    status text DEFAULT 'PENDING'::text NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO security360_user;

--
-- Name: Job; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Job" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "teamMemberId" text,
    status text DEFAULT 'SCHEDULED'::text NOT NULL,
    "scheduledDate" timestamp(3) without time zone,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Job" OWNER TO security360_user;

--
-- Name: JobPhoto; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."JobPhoto" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JobPhoto" OWNER TO security360_user;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO security360_user;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reference text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    method text NOT NULL
);


ALTER TABLE public."Payment" OWNER TO security360_user;

--
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."PurchaseOrder" (
    id text NOT NULL,
    "supplierId" text NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrder" OWNER TO security360_user;

--
-- Name: PurchaseOrderItem; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."PurchaseOrderItem" (
    id text NOT NULL,
    "purchaseOrderId" text NOT NULL,
    "catalogItemId" text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL
);


ALTER TABLE public."PurchaseOrderItem" OWNER TO security360_user;

--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."Supplier" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Supplier" OWNER TO security360_user;

--
-- Name: SupportTicket; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."SupportTicket" (
    id text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    priority text DEFAULT 'LOW'::text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customerId" text,
    "quoteId" text
);


ALTER TABLE public."SupportTicket" OWNER TO security360_user;

--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."TeamMember" (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    email text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO security360_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    password text,
    role text DEFAULT 'USER'::text NOT NULL,
    "clerkId" text
);


ALTER TABLE public."User" OWNER TO security360_user;

--
-- Name: bill_of_materials; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public.bill_of_materials (
    id text NOT NULL,
    "fencingServiceId" text NOT NULL,
    "catalogItemId" text NOT NULL,
    "quantityPerMeter" numeric(10,4) NOT NULL,
    "wastageFactor" numeric(5,2) DEFAULT 1.10 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bill_of_materials OWNER TO security360_user;

--
-- Name: business_configs; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public.business_configs (
    id text NOT NULL,
    "companyName" text DEFAULT 'Security 360'::text NOT NULL,
    "supportEmail" text,
    "supportPhone" text,
    address text,
    "bankName" text,
    "bankAccName" text,
    "bankAccNumber" text,
    "bankBranch" text,
    terms text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.business_configs OWNER TO security360_user;

--
-- Name: catalog_items; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public.catalog_items (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    unit text DEFAULT 'item'::text NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "minStockLevel" numeric(10,2) DEFAULT 0 NOT NULL,
    "stockLevel" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.catalog_items OWNER TO security360_user;

--
-- Name: tax_configs; Type: TABLE; Schema: public; Owner: security360_user
--

CREATE TABLE public.tax_configs (
    id text NOT NULL,
    name text DEFAULT 'VAT'::text NOT NULL,
    rate numeric(5,4) DEFAULT 0.15 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tax_configs OWNER TO security360_user;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."AuditLog" (id, action, "entityType", "entityId", "performedBy", "createdAt", metadata, "userId") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Customer" (id, name, phone, address, "createdAt", email) FROM stdin;
5bd4754b-c20c-43bf-81e3-e7c316869098	Residential Customer	+263123456789	123 Harare Drive	2026-01-21 11:18:07.968	\N
9b0d3206-4824-48bd-983f-f6bd9eb2ee7c	Commercial Client	+263987654321	456 Bulawayo Rd	2026-01-21 11:18:07.97	\N
\.


--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Expense" (id, amount, category, description, date, "createdAt", "jobId") FROM stdin;
f9886957-6176-43c5-8131-a0b92ce26582	1250.00	Materials	Timber Posts x50 (Larch)	2026-01-21 11:18:07.984	2026-01-21 11:18:07.988	\N
d91e5bbb-d4c8-49d2-a4e5-fa86959a5352	85.40	Fuel	Van Refuel - Shell Station	2026-01-21 11:18:07.984	2026-01-21 11:18:07.99	\N
5c7a59b5-704a-40d5-b641-b20acab954ff	450.00	Tools	Hilti Drill Repair	2026-01-21 11:18:07.984	2026-01-21 11:18:07.992	\N
\.


--
-- Data for Name: FenceQuote; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."FenceQuote" (id, "customerId", "fencingServiceId", "lengthMeters", "heightMeters", terrain, "addOnIds", subtotal, vat, total, status, "createdAt", "pipelineStage", "signatureData", "signedAt") FROM stdin;
6c8c0806-9aad-4850-8d35-d77910bea532	5bd4754b-c20c-43bf-81e3-e7c316869098	9d928b50-21ac-4a72-bcb7-b9277b770b37	50.00	1.80	FLAT	{}	850.00	127.50	977.50	DRAFT	2026-01-21 11:18:08.013	LEAD	\N	\N
\.


--
-- Data for Name: FencingAddon; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."FencingAddon" (id, name, price, "createdAt", "pricingType") FROM stdin;
520067a1-ee85-480c-bd64-092cd663a730	Razor topping	5.00	2026-01-21 11:18:07.963	PER_METER
61083dc2-e1b4-4632-8783-1d562f6cb4c9	Gate	500.00	2026-01-21 11:18:07.965	FLAT
945d9f1f-92ba-4140-8f46-eed82acd0bf0	Concrete footing	10.00	2026-01-21 11:18:07.966	PER_METER
\.


--
-- Data for Name: FencingService; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."FencingService" (id, name, "pricePerMeter", "installationFee", "supportsElectric", "supportsRazor", "isActive", "createdAt", description) FROM stdin;
9d928b50-21ac-4a72-bcb7-b9277b770b37	Diamond Mesh	15.00	100.00	f	t	t	2026-01-21 11:18:07.952	\N
f9c5699e-e466-4550-830a-974b12634b62	Game Fence	25.00	150.00	t	f	t	2026-01-21 11:18:07.956	\N
82aa6a91-50e8-41aa-9d55-ba83bc22d6e4	Electric Fence	12.00	200.00	t	f	t	2026-01-21 11:18:07.958	\N
d8c026c9-2482-4d42-848f-b0b366717edf	Razor Wire	8.00	80.00	t	t	t	2026-01-21 11:18:07.96	\N
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Invoice" (id, "invoiceNumber", "customerId", subtotal, vat, total, "createdAt", "issuedAt", "quoteId", status) FROM stdin;
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Job" (id, "invoiceId", "teamMemberId", status, "scheduledDate", "startedAt", "completedAt", notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: JobPhoto; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."JobPhoto" (id, "jobId", url, type, "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Notification" (id, type, title, message, read, "createdAt") FROM stdin;
ddb83c14-c6ac-48ff-90ae-ea3f22aefe28	ALERT	New Quote Request	Customer "Mark Spencer" requested a quote for a 20m perimeter fence.	f	2026-01-21 11:18:08
3c705d01-482f-47c5-99bf-c78a563dd438	SUCCESS	Payment Received	Invoice INV-4410 has been paid in full by Sarah Wilson.	f	2026-01-21 11:18:08.002
9351fc72-c464-488f-a263-46bf0402e342	WARNING	Late Payment Reminder	Invoice INV-4398 is 3 days overdue.	f	2026-01-21 11:18:08.004
7e223eed-c184-42d3-a1bf-d9f8b31cb859	INFO	System Update	Security 360 will undergo maintenance on Sunday at 2 AM GMT.	f	2026-01-21 11:18:08.005
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Payment" (id, "invoiceId", amount, "createdAt", reference, status, method) FROM stdin;
\.


--
-- Data for Name: PurchaseOrder; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."PurchaseOrder" (id, "supplierId", status, total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PurchaseOrderItem; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."PurchaseOrderItem" (id, "purchaseOrderId", "catalogItemId", quantity, "unitPrice", "totalPrice") FROM stdin;
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."Supplier" (id, name, email, phone, address, "createdAt") FROM stdin;
daa6c8fd-baf5-42e8-a2d5-49dc1ada79a0	Harare Timber & Steel	sales@hararetimber.co.zw	+263 242 123456	15 Coventry Rd, Workington	2026-01-21 11:18:08.007
1a7e6c4e-2184-47a2-8517-57e038c072dd	Global Fencing Supplies	info@globalfencing.com	+263 772 987654	88 Willowvale Rd	2026-01-21 11:18:08.009
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."SupportTicket" (id, subject, message, status, priority, "userId", "createdAt", "updatedAt", "customerId", "quoteId") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."TeamMember" (id, name, role, email, status, "createdAt") FROM stdin;
ad1487ea-0984-476f-b14f-ef3c6b4bb545	John Doe	Administrator	john@security360.co.zw	ACTIVE	2026-01-21 11:18:07.994
8a97b6c4-c55c-4c38-b9cb-4bc12c897613	Jane Smith	Project Manager	jane@security360.co.zw	ACTIVE	2026-01-21 11:18:07.996
d78aca7c-2d6a-4955-bf8d-21e1a1baa487	Robert Fox	Field Technician	robert@security360.co.zw	AWAY	2026-01-21 11:18:07.998
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public."User" (id, email, "isActive", "createdAt", name, password, role, "clerkId") FROM stdin;
646ae909-32cc-4a45-bf06-8de2c137b8b9	admin@security360.co.zw	t	2026-01-08 13:35:56.885	Admin User	$2a$10$G6ANqWONEMtDQPsQ2WVMu.TL0miHXJ1fGnwh5VP00AOQo6Sq0depe	ADMIN	user_381U9VFL8lCS8uW3VinzIF68Wzs
b9d364c7-890f-48e7-a254-5c8308de6fb1	sales@security360.co.zw	t	2026-01-08 13:35:56.905	Sales User	$2a$10$G6ANqWONEMtDQPsQ2WVMu.TL0miHXJ1fGnwh5VP00AOQo6Sq0depe	SALES	user_384HlbxcdqicYomuwz8WJzu4dcc
c186498e-9fc7-4aaa-ac32-8b7e0bdba80e	finance@security360.co.zw	t	2026-01-08 13:35:56.901	Finance User	$2a$10$G6ANqWONEMtDQPsQ2WVMu.TL0miHXJ1fGnwh5VP00AOQo6Sq0depe	MANAGER	\N
\.


--
-- Data for Name: bill_of_materials; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public.bill_of_materials (id, "fencingServiceId", "catalogItemId", "quantityPerMeter", "wastageFactor", "createdAt") FROM stdin;
441ba6db-8603-46a7-a482-26baae4611f9	9d928b50-21ac-4a72-bcb7-b9277b770b37	2a70189b-58ba-447e-a2f5-afdb5d77886b	0.3300	1.05	2026-01-21 11:18:07.982
df96c76d-23ac-4555-9cae-bd0c41278231	9d928b50-21ac-4a72-bcb7-b9277b770b37	39f97041-f328-4c72-8b12-a9daf3da1f2f	1.0000	1.10	2026-01-21 11:18:07.982
71585622-5536-49ee-9df9-163f129e6791	9d928b50-21ac-4a72-bcb7-b9277b770b37	3d163f5f-193d-4391-9e12-724fbdf15242	0.1000	1.00	2026-01-21 11:18:07.982
\.


--
-- Data for Name: business_configs; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public.business_configs (id, "companyName", "supportEmail", "supportPhone", address, "bankName", "bankAccName", "bankAccNumber", "bankBranch", terms, "updatedAt") FROM stdin;
\.


--
-- Data for Name: catalog_items; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public.catalog_items (id, name, description, price, unit, category, "createdAt", "updatedAt", "minStockLevel", "stockLevel") FROM stdin;
2a70189b-58ba-447e-a2f5-afdb5d77886b	Larch Timber Post	Standard 2.4m post	15.50	each	Materials	2026-01-21 11:18:07.972	2026-01-21 11:18:07.972	0.00	0.00
39f97041-f328-4c72-8b12-a9daf3da1f2f	Chain Link Wire	Galvanized 50mm mesh	12.00	m	Materials	2026-01-21 11:18:07.974	2026-01-21 11:18:07.974	0.00	0.00
eba6f916-0e05-4e6a-a6fd-62ac5a87e845	Site Survey	On-site assessment	75.00	hour	Service	2026-01-21 11:18:07.976	2026-01-21 11:18:07.976	0.00	0.00
3d163f5f-193d-4391-9e12-724fbdf15242	Cement (50kg)	Standard Portland Cement	14.00	bag	Materials	2026-01-21 11:18:07.978	2026-01-21 11:18:07.978	0.00	0.00
\.


--
-- Data for Name: tax_configs; Type: TABLE DATA; Schema: public; Owner: security360_user
--

COPY public.tax_configs (id, name, rate, "isActive", "updatedAt") FROM stdin;
3e8612b0-abda-4b4f-aecd-6cff370be2f7	VAT	0.1000	t	2026-01-10 21:03:07.108
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: FenceQuote FenceQuote_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."FenceQuote"
    ADD CONSTRAINT "FenceQuote_pkey" PRIMARY KEY (id);


--
-- Name: FencingAddon FencingAddon_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."FencingAddon"
    ADD CONSTRAINT "FencingAddon_pkey" PRIMARY KEY (id);


--
-- Name: FencingService FencingService_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."FencingService"
    ADD CONSTRAINT "FencingService_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: JobPhoto JobPhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."JobPhoto"
    ADD CONSTRAINT "JobPhoto_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrderItem PurchaseOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: bill_of_materials bill_of_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.bill_of_materials
    ADD CONSTRAINT bill_of_materials_pkey PRIMARY KEY (id);


--
-- Name: business_configs business_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.business_configs
    ADD CONSTRAINT business_configs_pkey PRIMARY KEY (id);


--
-- Name: catalog_items catalog_items_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT catalog_items_pkey PRIMARY KEY (id);


--
-- Name: tax_configs tax_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.tax_configs
    ADD CONSTRAINT tax_configs_pkey PRIMARY KEY (id);


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entityId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "AuditLog_entityId_idx" ON public."AuditLog" USING btree ("entityId");


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: Customer_name_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Customer_name_idx" ON public."Customer" USING btree (name);


--
-- Name: Expense_category_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Expense_category_idx" ON public."Expense" USING btree (category);


--
-- Name: Expense_date_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Expense_date_idx" ON public."Expense" USING btree (date);


--
-- Name: Expense_jobId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Expense_jobId_idx" ON public."Expense" USING btree ("jobId");


--
-- Name: FenceQuote_createdAt_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "FenceQuote_createdAt_idx" ON public."FenceQuote" USING btree ("createdAt");


--
-- Name: FenceQuote_customerId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "FenceQuote_customerId_idx" ON public."FenceQuote" USING btree ("customerId");


--
-- Name: FenceQuote_pipelineStage_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "FenceQuote_pipelineStage_idx" ON public."FenceQuote" USING btree ("pipelineStage");


--
-- Name: FenceQuote_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "FenceQuote_status_idx" ON public."FenceQuote" USING btree (status);


--
-- Name: FencingService_isActive_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "FencingService_isActive_idx" ON public."FencingService" USING btree ("isActive");


--
-- Name: Invoice_customerId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Invoice_customerId_idx" ON public."Invoice" USING btree ("customerId");


--
-- Name: Invoice_invoiceNumber_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Invoice_invoiceNumber_idx" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: Invoice_issuedAt_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Invoice_issuedAt_idx" ON public."Invoice" USING btree ("issuedAt");


--
-- Name: Invoice_quoteId_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "Invoice_quoteId_key" ON public."Invoice" USING btree ("quoteId");


--
-- Name: Invoice_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Invoice_status_idx" ON public."Invoice" USING btree (status);


--
-- Name: JobPhoto_jobId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "JobPhoto_jobId_idx" ON public."JobPhoto" USING btree ("jobId");


--
-- Name: Job_invoiceId_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "Job_invoiceId_key" ON public."Job" USING btree ("invoiceId");


--
-- Name: Job_scheduledDate_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Job_scheduledDate_idx" ON public."Job" USING btree ("scheduledDate");


--
-- Name: Job_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Job_status_idx" ON public."Job" USING btree (status);


--
-- Name: Job_teamMemberId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Job_teamMemberId_idx" ON public."Job" USING btree ("teamMemberId");


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_read_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Notification_read_idx" ON public."Notification" USING btree (read);


--
-- Name: Payment_invoiceId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Payment_invoiceId_idx" ON public."Payment" USING btree ("invoiceId");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: PurchaseOrderItem_catalogItemId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "PurchaseOrderItem_catalogItemId_idx" ON public."PurchaseOrderItem" USING btree ("catalogItemId");


--
-- Name: PurchaseOrderItem_purchaseOrderId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON public."PurchaseOrderItem" USING btree ("purchaseOrderId");


--
-- Name: PurchaseOrder_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "PurchaseOrder_status_idx" ON public."PurchaseOrder" USING btree (status);


--
-- Name: PurchaseOrder_supplierId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "PurchaseOrder_supplierId_idx" ON public."PurchaseOrder" USING btree ("supplierId");


--
-- Name: SupportTicket_customerId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "SupportTicket_customerId_idx" ON public."SupportTicket" USING btree ("customerId");


--
-- Name: SupportTicket_quoteId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "SupportTicket_quoteId_idx" ON public."SupportTicket" USING btree ("quoteId");


--
-- Name: SupportTicket_status_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "SupportTicket_status_idx" ON public."SupportTicket" USING btree (status);


--
-- Name: SupportTicket_userId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "SupportTicket_userId_idx" ON public."SupportTicket" USING btree ("userId");


--
-- Name: TeamMember_email_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "TeamMember_email_key" ON public."TeamMember" USING btree (email);


--
-- Name: User_clerkId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "User_clerkId_idx" ON public."User" USING btree ("clerkId");


--
-- Name: User_clerkId_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "User_clerkId_key" ON public."User" USING btree ("clerkId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: bill_of_materials_catalogItemId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "bill_of_materials_catalogItemId_idx" ON public.bill_of_materials USING btree ("catalogItemId");


--
-- Name: bill_of_materials_fencingServiceId_idx; Type: INDEX; Schema: public; Owner: security360_user
--

CREATE INDEX "bill_of_materials_fencingServiceId_idx" ON public.bill_of_materials USING btree ("fencingServiceId");


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FenceQuote FenceQuote_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."FenceQuote"
    ADD CONSTRAINT "FenceQuote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FenceQuote FenceQuote_fencingServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."FenceQuote"
    ADD CONSTRAINT "FenceQuote_fencingServiceId_fkey" FOREIGN KEY ("fencingServiceId") REFERENCES public."FencingService"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public."FenceQuote"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JobPhoto JobPhoto_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."JobPhoto"
    ADD CONSTRAINT "JobPhoto_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public."TeamMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_catalogItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES public.catalog_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SupportTicket SupportTicket_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SupportTicket SupportTicket_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public."FenceQuote"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SupportTicket SupportTicket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bill_of_materials bill_of_materials_fencingServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.bill_of_materials
    ADD CONSTRAINT "bill_of_materials_fencingServiceId_fkey" FOREIGN KEY ("fencingServiceId") REFERENCES public."FencingService"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bill_of_materials bom_catalog_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: security360_user
--

ALTER TABLE ONLY public.bill_of_materials
    ADD CONSTRAINT bom_catalog_item_fkey FOREIGN KEY ("catalogItemId") REFERENCES public.catalog_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO security360_user;


--
-- PostgreSQL database dump complete
--

\unrestrict LNsvMa4GlMjRNjj0RErtgRVzvnPtKj0nzq9CicQq2kclPTM2hFg6NiR3zJMrAhu

