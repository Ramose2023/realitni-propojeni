from flask import Blueprint, request, jsonify, session
from src.services.credit_service import get_agent_credits, purchase_credits, use_credits, get_credit_transactions

credits_bp = Blueprint('credits', __name__)

@credits_bp.route('/balance', methods=['GET'])
def get_balance():
    """
    Získání aktuálního stavu kreditů makléře
    """
    token = session.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Uživatel není přihlášen'}), 401
    
    try:
        credits = get_agent_credits(token)
        return jsonify({
            'status': 'success',
            'credits': credits
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@credits_bp.route('/purchase', methods=['POST'])
def purchase():
    """
    Nákup kreditů
    ---
    Očekává JSON s:
    - amount: počet kreditů k nákupu
    - payment_method: metoda platby (card, bank_transfer)
    """
    token = session.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Uživatel není přihlášen'}), 401
    
    data = request.get_json()
    
    # Validace vstupních dat
    if 'amount' not in data:
        return jsonify({'status': 'error', 'message': 'Chybí počet kreditů k nákupu'}), 400
    
    if 'payment_method' not in data:
        return jsonify({'status': 'error', 'message': 'Chybí metoda platby'}), 400
    
    if data['payment_method'] not in ['card', 'bank_transfer']:
        return jsonify({'status': 'error', 'message': 'Neplatná metoda platby. Povolené hodnoty: card, bank_transfer'}), 400
    
    try:
        amount = int(data['amount'])
        if amount <= 0:
            return jsonify({'status': 'error', 'message': 'Počet kreditů musí být kladné číslo'}), 400
    except ValueError:
        return jsonify({'status': 'error', 'message': 'Počet kreditů musí být číslo'}), 400
    
    try:
        payment_info = purchase_credits(
            token=token,
            amount=amount,
            payment_method=data['payment_method']
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Platba byla zahájena',
            'payment_info': payment_info
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@credits_bp.route('/use', methods=['POST'])
def use():
    """
    Použití kreditů pro získání přístupu ke kontaktům
    ---
    Očekává JSON s:
    - property_id: ID nemovitosti
    """
    token = session.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Uživatel není přihlášen'}), 401
    
    data = request.get_json()
    
    # Validace vstupních dat
    if 'property_id' not in data:
        return jsonify({'status': 'error', 'message': 'Chybí ID nemovitosti'}), 400
    
    try:
        access_info = use_credits(
            token=token,
            property_id=data['property_id']
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Přístup ke kontaktům byl udělen',
            'access_info': access_info
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@credits_bp.route('/transactions', methods=['GET'])
def transactions():
    """
    Získání historie transakcí kreditů
    """
    token = session.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Uživatel není přihlášen'}), 401
    
    try:
        transactions = get_credit_transactions(token)
        return jsonify({
            'status': 'success',
            'transactions': transactions
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
