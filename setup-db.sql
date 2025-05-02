-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  deadline TEXT,
  amount TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_fully_funded BOOLEAN DEFAULT FALSE,
  country_id INTEGER REFERENCES countries(id),
  level_id INTEGER REFERENCES levels(id),
  category_id INTEGER REFERENCES categories(id),
  requirements TEXT,
  application_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) NOT NULL,
  tag_id INTEGER REFERENCES tags(id) NOT NULL
);

-- Create success_stories table
CREATE TABLE IF NOT EXISTS success_stories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  scholarship_name TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id SERIAL PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  keywords TEXT
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  site_name TEXT NOT NULL,
  site_tagline TEXT,
  site_description TEXT,
  favicon TEXT,
  logo TEXT,
  logo_dark TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  facebook TEXT,
  twitter TEXT,
  instagram TEXT,
  youtube TEXT,
  linkedin TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  enable_dark_mode BOOLEAN,
  rtl_direction BOOLEAN,
  default_language TEXT,
  enable_newsletter BOOLEAN,
  enable_scholarship_search BOOLEAN,
  footer_text TEXT,
  
  -- Home Page Sections
  show_hero_section BOOLEAN,
  show_featured_scholarships BOOLEAN,
  show_search_section BOOLEAN,
  show_categories_section BOOLEAN,
  show_countries_section BOOLEAN,
  show_latest_articles BOOLEAN,
  show_success_stories BOOLEAN,
  show_newsletter_section BOOLEAN,
  show_statistics_section BOOLEAN,
  show_partners_section BOOLEAN,
  
  -- Section Titles and Descriptions
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  featured_scholarships_title TEXT,
  featured_scholarships_description TEXT,
  categories_section_title TEXT,
  categories_section_description TEXT,
  countries_section_title TEXT,
  countries_section_description TEXT,
  latest_articles_title TEXT,
  latest_articles_description TEXT,
  success_stories_title TEXT,
  success_stories_description TEXT,
  newsletter_section_title TEXT,
  newsletter_section_description TEXT,
  statistics_section_title TEXT,
  statistics_section_description TEXT,
  partners_section_title TEXT,
  partners_section_description TEXT,
  
  -- Page Layouts
  home_page_layout TEXT,
  scholarship_page_layout TEXT,
  article_page_layout TEXT,
  
  -- Custom CSS
  custom_css TEXT
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  show_in_footer BOOLEAN DEFAULT FALSE,
  show_in_header BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add some default data (admin user)
INSERT INTO users (username, password, email, display_name, role) 
VALUES ('admin', 'admin123', 'admin@example.com', 'Administrator', 'admin')
ON CONFLICT (username) DO NOTHING;