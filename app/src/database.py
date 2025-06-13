from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("https://rchnhqmzbwpjtvurblsc.supabase.co ")
supabase_key = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaG5ocW16YndwanR2dXJibHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MzMwMzEsImV4cCI6MjA2NTQwOTAzMX0.hBYduEgXTZf0oYX-JsaYc3nJXnp1Ydvq3PsQTeqGz2Y")
supabase = create_client(supabase_url, supabase_key)