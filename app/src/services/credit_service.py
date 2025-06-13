from typing import Dict, List, Any, Optional
import os
import uuid
from supabase import Client
from datetime import datetime

# Import Supabase klienta z hlavní aplikace
def get_supabase() -> Client:
    """Získání instance Supabase klienta"""
    from src.main import supabase
    if not supabase:
        raise Exception("Supabase klient není inicializován")
    return supabase

def get_user_from_token(token: str) -> Dict[str, Any]:
    """
    Získání informací o uživateli z tokenu
    
    Args:
        token: Přístupový token uživatele
        
    Returns:
        Dict obsahující informace o uživateli
        
    Raises:
        Exception: Pokud získání informací selže nebo uživatel není makléř
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
        
        # Kontrola, zda je uživatel makléř
        if user_data["user_type"] != "agent":
            raise Exception("Pouze makléři mohou pracovat s kredity")
        
        return user_data
    
    except Exception as e:
        raise Exception(f"Získání informací o uživateli selhalo: {str(e)}")

def get_agent_credits(token: str) -> Dict[str, Any]:
    """
    Získání aktuálního stavu kreditů makléře
    
    Args:
        token: Přístupový token uživatele
        
    Returns:
        Dict obsahující informace o kreditech
        
    Raises:
        Exception: Pokud získání informací selže
    """
    user_data = get_user_from_token(token)
    user_id = user_data["id"]
    
    supabase = get_supabase()
    
    try:
        # Získání kreditů makléře
        credits_response = supabase.table("agent_credits").select("*").eq("agent_id", user_id).execute()
        
        if not credits_response.data:
            # Pokud záznam neexistuje, vytvoříme ho
            credits_data = {
                "agent_id": user_id,
                "balance": 0
            }
            
            credits_response = supabase.table("agent_credits").insert(credits_data).execute()
        
        return credits_response.data[0]
    
    except Exception as e:
        raise Exception(f"Získání stavu kreditů selhalo: {str(e)}")

def purchase_credits(token: str, amount: int, payment_method: str) -> Dict[str, Any]:
    """
    Nákup kreditů
    
    Args:
        token: Přístupový token uživatele
        amount: Počet kreditů k nákupu
        payment_method: Metoda platby (card, bank_transfer)
        
    Returns:
        Dict obsahující informace o platbě
        
    Raises:
        Exception: Pokud nákup selže
    """
    user_data = get_user_from_token(token)
    user_id = user_data["id"]
    
    supabase = get_supabase()
    
    # Cena za jeden kredit (v Kč)
    CREDIT_PRICE = 50
    
    # Výpočet celkové ceny
    total_price = amount * CREDIT_PRICE
    
    try:
        # Vytvoření platby (zde by byla integrace s platební bránou)
        # Pro demonstrační účely simulujeme úspěšnou platbu
        
        # Generování ID platby
        payment_id = str(uuid.uuid4())
        
        # Vytvoření záznamu o transakci
        transaction_data = {
            "agent_id": user_id,
            "amount": amount,
            "transaction_type": "purchase",
            "description": f"Nákup {amount} kreditů ({payment_method})",
            "payment_id": payment_id,
            "created_at": datetime.now().isoformat()
        }
        
        transaction_response = supabase.table("credit_transactions").insert(transaction_data).execute()
        
        # Aktualizace stavu kreditů
        credits_response = supabase.table("agent_credits").select("*").eq("agent_id", user_id).execute()
        
        if not credits_response.data:
            # Pokud záznam neexistuje, vytvoříme ho
            credits_data = {
                "agent_id": user_id,
                "balance": amount
            }
            
            supabase.table("agent_credits").insert(credits_data).execute()
        else:
            current_balance = credits_response.data[0]["balance"]
            new_balance = current_balance + amount
            
            supabase.table("agent_credits").update({"balance": new_balance}).eq("agent_id", user_id).execute()
        
        # Vrácení informací o platbě
        return {
            "payment_id": payment_id,
            "amount": amount,
            "total_price": total_price,
            "currency": "CZK",
            "payment_method": payment_method,
            "status": "completed",  # V reálné implementaci by zde byl odkaz na platební bránu
            "transaction_id": transaction_response.data[0]["id"]
        }
    
    except Exception as e:
        raise Exception(f"Nákup kreditů selhal: {str(e)}")

def use_credits(token: str, property_id: str) -> Dict[str, Any]:
    """
    Použití kreditů pro získání přístupu ke kontaktům
    
    Args:
        token: Přístupový token uživatele
        property_id: ID nemovitosti
        
    Returns:
        Dict obsahující informace o přístupu
        
    Raises:
        Exception: Pokud použití kreditů selže
    """
    user_data = get_user_from_token(token)
    user_id = user_data["id"]
    
    supabase = get_supabase()
    
    # Cena za přístup ke kontaktům (v kreditech)
    ACCESS_COST = 5
    
    try:
        # Kontrola, zda již nemá přístup
        access_response = supabase.table("contact_access").select("*").eq("agent_id", user_id).eq("property_id", property_id).execute()
        
        if access_response.data:
            return {
                "access_id": access_response.data[0]["id"],
                "property_id": property_id,
                "status": "active",
                "granted_at": access_response.data[0]["granted_at"]
            }
        
        # Kontrola stavu kreditů
        credits_response = supabase.table("agent_credits").select("*").eq("agent_id", user_id).execute()
        
        if not credits_response.data:
            raise Exception("Nemáte žádné kredity")
        
        current_balance = credits_response.data[0]["balance"]
        
        if current_balance < ACCESS_COST:
            raise Exception(f"Nedostatek kreditů. Potřebujete {ACCESS_COST} kreditů, máte {current_balance} kreditů")
        
        # Vytvoření záznamu o transakci
        transaction_data = {
            "agent_id": user_id,
            "amount": -ACCESS_COST,  # Záporná hodnota pro odečtení kreditů
            "transaction_type": "usage",
            "description": f"Přístup ke kontaktům nemovitosti {property_id}",
            "created_at": datetime.now().isoformat()
        }
        
        transaction_response = supabase.table("credit_transactions").insert(transaction_data).execute()
        transaction_id = transaction_response.data[0]["id"]
        
        # Aktualizace stavu kreditů
        new_balance = current_balance - ACCESS_COST
        supabase.table("agent_credits").update({"balance": new_balance}).eq("agent_id", user_id).execute()
        
        # Vytvoření záznamu o přístupu
        access_data = {
            "agent_id": user_id,
            "property_id": property_id,
            "granted_at": datetime.now().isoformat(),
            "status": "active",
            "credit_transaction_id": transaction_id
        }
        
        access_response = supabase.table("contact_access").insert(access_data).execute()
        
        # Vrácení informací o přístupu
        return {
            "access_id": access_response.data[0]["id"],
            "property_id": property_id,
            "status": "active",
            "granted_at": access_data["granted_at"],
            "credits_used": ACCESS_COST,
            "credits_remaining": new_balance
        }
    
    except Exception as e:
        raise Exception(f"Použití kreditů selhalo: {str(e)}")

def get_credit_transactions(token: str) -> List[Dict[str, Any]]:
    """
    Získání historie transakcí kreditů
    
    Args:
        token: Přístupový token uživatele
        
    Returns:
        List obsahující informace o transakcích
        
    Raises:
        Exception: Pokud získání informací selže
    """
    user_data = get_user_from_token(token)
    user_id = user_data["id"]
    
    supabase = get_supabase()
    
    try:
        # Získání transakcí makléře
        transactions_response = supabase.table("credit_transactions").select("*").eq("agent_id", user_id).order("created_at", desc=True).execute()
        
        return transactions_response.data
    
    except Exception as e:
        raise Exception(f"Získání historie transakcí selhalo: {str(e)}")
