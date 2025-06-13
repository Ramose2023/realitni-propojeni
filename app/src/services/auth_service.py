from typing import Tuple, Dict, Optional, Any
import os
from supabase import Client
from flask import current_app

# Import Supabase klienta z hlavní aplikace
def get_supabase() -> Client:
    """Získání instance Supabase klienta"""
    from src.main import supabase
    if not supabase:
        raise Exception("Supabase klient není inicializován")
    return supabase

def register_user(email: str, password: str, user_type: str, full_name: str, phone: str = "") -> Dict[str, Any]:
    """
    Registrace nového uživatele
    
    Args:
        email: Email uživatele
        password: Heslo uživatele
        user_type: Typ uživatele (seller/agent)
        full_name: Jméno a příjmení
        phone: Telefonní číslo (volitelné)
        
    Returns:
        Dict obsahující informace o uživateli
        
    Raises:
        Exception: Pokud registrace selže
    """
    supabase = get_supabase()
    
    try:
        # Registrace uživatele v Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        user_id = auth_response.user.id
        
        # Vytvoření záznamu v tabulce users
        user_data = {
            "id": user_id,
            "email": email,
            "user_type": user_type,
            "full_name": full_name,
            "phone": phone,
            "status": "active",
            "auth_provider": "email"
        }
        
        user_response = supabase.table("users").insert(user_data).execute()
        
        # Vytvoření profilu podle typu uživatele
        if user_type == "seller":
            supabase.table("seller_profiles").insert({
                "user_id": user_id
            }).execute()
        elif user_type == "agent":
            # Pro makléře vytvoříme profil a inicializujeme kredity
            supabase.table("agent_profiles").insert({
                "user_id": user_id,
                "average_rating": 0,
                "successful_transactions": 0
            }).execute()
            
            supabase.table("agent_credits").insert({
                "agent_id": user_id,
                "balance": 0
            }).execute()
        
        return {
            "id": user_id,
            "email": email,
            "user_type": user_type,
            "full_name": full_name
        }
    
    except Exception as e:
        # Pokud dojde k chybě, pokusíme se vyčistit případně vytvořené záznamy
        if 'user_id' in locals():
            try:
                supabase.auth.admin.delete_user(user_id)
            except:
                pass
        raise Exception(f"Registrace selhala: {str(e)}")

def login_user(email: str, password: str) -> Tuple[Dict[str, Any], str]:
    """
    Přihlášení uživatele pomocí emailu a hesla
    
    Args:
        email: Email uživatele
        password: Heslo uživatele
        
    Returns:
        Tuple obsahující informace o uživateli a přístupový token
        
    Raises:
        Exception: Pokud přihlášení selže
    """
    supabase = get_supabase()
    
    try:
        # Přihlášení uživatele v Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        user_id = auth_response.user.id
        token = auth_response.session.access_token
        
        # Získání detailů uživatele z tabulky users
        user_response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            raise Exception("Uživatelský profil nebyl nalezen")
        
        user_data = user_response.data[0]
        
        return user_data, token
    
    except Exception as e:
        raise Exception(f"Přihlášení selhalo: {str(e)}")

def login_with_google(google_token: str, user_type: Optional[str] = None) -> Tuple[Dict[str, Any], str, bool]:
    """
    Přihlášení nebo registrace uživatele pomocí Google
    
    Args:
        google_token: ID token z Google přihlášení
        user_type: Typ uživatele (seller/agent) - pouze při první registraci
        
    Returns:
        Tuple obsahující informace o uživateli, přístupový token a příznak, zda jde o nového uživatele
        
    Raises:
        Exception: Pokud přihlášení selže
    """
    supabase = get_supabase()
    
    try:
        # Přihlášení uživatele v Supabase Auth pomocí Google tokenu
        auth_response = supabase.auth.sign_in_with_id_token({
            "provider": "google",
            "token": google_token
        })
        
        user_id = auth_response.user.id
        token = auth_response.session.access_token
        is_new_user = auth_response.user.app_metadata.get("provider") == "google" and auth_response.user.created_at == auth_response.user.updated_at
        
        # Pokud jde o nového uživatele, vytvoříme záznam v tabulce users
        if is_new_user:
            if not user_type:
                raise Exception("Pro nového uživatele je nutné specifikovat typ uživatele")
            
            if user_type not in ["seller", "agent"]:
                raise Exception("Neplatný typ uživatele. Povolené hodnoty: seller, agent")
            
            user_data = {
                "id": user_id,
                "email": auth_response.user.email,
                "user_type": user_type,
                "full_name": auth_response.user.user_metadata.get("full_name", ""),
                "status": "active",
                "auth_provider": "google"
            }
            
            user_response = supabase.table("users").insert(user_data).execute()
            
            # Vytvoření profilu podle typu uživatele
            if user_type == "seller":
                supabase.table("seller_profiles").insert({
                    "user_id": user_id
                }).execute()
            elif user_type == "agent":
                # Pro makléře vytvoříme profil a inicializujeme kredity
                supabase.table("agent_profiles").insert({
                    "user_id": user_id,
                    "average_rating": 0,
                    "successful_transactions": 0
                }).execute()
                
                supabase.table("agent_credits").insert({
                    "agent_id": user_id,
                    "balance": 0
                }).execute()
            
            user_data = user_response.data[0]
        else:
            # Získání detailů uživatele z tabulky users
            user_response = supabase.table("users").select("*").eq("id", user_id).execute()
            
            if not user_response.data:
                raise Exception("Uživatelský profil nebyl nalezen")
            
            user_data = user_response.data[0]
        
        return user_data, token, is_new_user
    
    except Exception as e:
        raise Exception(f"Přihlášení přes Google selhalo: {str(e)}")

def logout_user(token: str) -> None:
    """
    Odhlášení uživatele
    
    Args:
        token: Přístupový token uživatele
        
    Raises:
        Exception: Pokud odhlášení selže
    """
    if not token:
        return
    
    supabase = get_supabase()
    
    try:
        supabase.auth.sign_out()
    except Exception as e:
        raise Exception(f"Odhlášení selhalo: {str(e)}")

def get_current_user(token: str) -> Dict[str, Any]:
    """
    Získání informací o přihlášeném uživateli
    
    Args:
        token: Přístupový token uživatele
        
    Returns:
        Dict obsahující informace o uživateli
        
    Raises:
        Exception: Pokud získání informací selže
    """
    supabase = get_supabase()
    
    try:
        # Nastavení tokenu pro autentizaci
        supabase.auth.set_session(token)
        
        # Získání aktuálního uživatele
        auth_user = supabase.auth.get_user()
        user_id = auth_user.user.id
        
        # Získání detailů uživatele z tabulky users
        user_response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            raise Exception("Uživatelský profil nebyl nalezen")
        
        user_data = user_response.data[0]
        
        # Získání dodatečných informací podle typu uživatele
        if user_data["user_type"] == "seller":
            profile_response = supabase.table("seller_profiles").select("*").eq("user_id", user_id).execute()
            if profile_response.data:
                user_data["profile"] = profile_response.data[0]
        elif user_data["user_type"] == "agent":
            profile_response = supabase.table("agent_profiles").select("*").eq("user_id", user_id).execute()
            if profile_response.data:
                user_data["profile"] = profile_response.data[0]
            
            credits_response = supabase.table("agent_credits").select("*").eq("agent_id", user_id).execute()
            if credits_response.data:
                user_data["credits"] = credits_response.data[0]
        
        return user_data
    
    except Exception as e:
        raise Exception(f"Získání informací o uživateli selhalo: {str(e)}")
