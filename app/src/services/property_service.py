from src.database import supabase

def create_property(data):
    response = supabase.table('properties').insert(data).execute()
    return response.data

def get_properties():
    response = supabase.table('properties').select('*').execute()
    return response.data

def get_property(id):
    response = supabase.table('properties').select('*').eq('id', id).execute()
    return response.data[0] if response.data else None

def update_property(id, data):
    response = supabase.table('properties').update(data).eq('id', id).execute()
    return response.data

def delete_property(id):
    response = supabase.table('properties').delete().eq('id', id).execute()
    return response.data