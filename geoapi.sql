--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

-- Started on 2018-02-18 19:50:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2811 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 24582)
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE test (
    id bigint NOT NULL,
    data json
);


ALTER TABLE test OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 24580)
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_id_seq OWNER TO postgres;

--
-- TOC entry 2812 (class 0 OID 0)
-- Dependencies: 196
-- Name: test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE test_id_seq OWNED BY test.id;


--
-- TOC entry 198 (class 1259 OID 24596)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "user" (
    username text NOT NULL,
    password text,
    plan text
);


ALTER TABLE "user" OWNER TO postgres;

--
-- TOC entry 2676 (class 2604 OID 24585)
-- Name: test id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY test ALTER COLUMN id SET DEFAULT nextval('test_id_seq'::regclass);


--
-- TOC entry 2803 (class 0 OID 24582)
-- Dependencies: 197
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY test (id, data) FROM stdin;
1	{"value": "test"}
\.


--
-- TOC entry 2804 (class 0 OID 24596)
-- Dependencies: 198
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "user" (username, password, plan) FROM stdin;
test	$2a$10$kMY6ZqVm4Wa2aWvlIb2GMuneaqcrGtL4A/9FzWVmDTDJyIFSk99HO	free
test2	$2a$10$cMlS/F3QPSJcPcPbJlD4oe2wbwkhGecHb676Bv8hdX6uzSE0.3HKW	premium
test3	$2a$10$a41bkFvGww7LNV46TUHDa.O.s33AmG/L923AAVCfydIgOKkYA2HYy	\N
\.


--
-- TOC entry 2813 (class 0 OID 0)
-- Dependencies: 196
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('test_id_seq', 1, true);


--
-- TOC entry 2678 (class 2606 OID 24590)
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- TOC entry 2680 (class 2606 OID 24603)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (username);


-- Completed on 2018-02-18 19:50:50

--
-- PostgreSQL database dump complete
--

