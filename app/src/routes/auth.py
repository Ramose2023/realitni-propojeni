from flask import Blueprint, request, jsonify, session
from src.services.auth_service import register_user, login_user, login_with_google, logout_user, get_current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registrace nového uživatele
    ---
    Očekává JSON s:
    - email: email uživatele
    - password: heslo uživatele
    - user_type: typ uživatele (seller/agent)
    - full_name: jméno a příjmení
    - phone: telefonní číslo (volitelné)
    """
    data = request.get_json()
    
    # Validace vstupních dat
    required_fields = ['email', 'password', 'user_type', 'full_name']
    for field in required_fields:
        if field not in data:
            return jsonify({'status': 'error', 'message': f'Chybí povinné pole: {field}'}), 400
    
    # Validace typu uživatele
    if data['user_type'] not in ['seller', 'agent']:
        return jsonify({'status': 'error', 'message': 'Neplatný typ uživatele. Povolené hodnoty: seller, agent'}), 400
    
    try:
        user = register_user(
            email=data['email'],
            password=data['password'],
            user_type=data['user_type'],
            full_name=data['full_name'],
            phone=data.get('phone', '')
        )
        return jsonify({
            'status': 'success',
            'message': 'Uživatel byl úspěšně zaregistrován',
            'user': user
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Přihlášení uživatele
    ---
    Očekává JSON s:
    - email: email uživatele
    - password: heslo uživatele
    """
    data = request.get_json()
    
    # Validace vstupních dat
    if 'email' not in data or 'password' not in data:
        return jsonify({'status': 'error', 'message': 'Chybí email nebo heslo'}), 400
    
    try:
        user, token = login_user(data['email'], data['password'])
        
        # Uložení tokenu do session
        session['token'] = token
        
        return jsonify({
            'status': 'success',
            'message': 'Přihlášení proběhlo úspěšně',
            'user': user,
            'token': token
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 401

@auth_bp.route('/google', methods=['POST'])
def google_login():
    """
    Přihlášení přes Google
    ---
    Očekává JSON s:
    - token: ID token z Google přihlášení
    - user_type: typ uživatele (seller/agent) - pouze při první registraci
    """
    data = request.get_json()
    
    if 'token' not in data:
        return jsonify({'status': 'error', 'message': 'Chybí Google token'}), 400
    
    try:
        user, token, is_new_user = login_with_google(
            google_token=data['token'],
            user_type=data.get('user_type')
        )
        
        # Uložení tokenu do session
        session['token'] = token
        
        return jsonify({
            'status': 'success',
            'message': 'Přihlášení přes Google proběhlo úspěšně',
            'user': user,
            'token': token,
            'is_new_user': is_new_user
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Odhlášení uživatele
    """
    try:
        logout_user(session.get('token'))
        session.pop('token', None)
        return jsonify({
            'status': 'success',
            'message': 'Odhlášení proběhlo úspěšně'
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@auth_bp.route('/me', methods=['GET'])
def me():
    """
    Získání informací o přihlášeném uživateli
    """
    token = session.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Uživatel není přihlášen'}), 401
    
    try:
        user = get_current_user(token)
        return jsonify({
            'status': 'success',
            'user': user
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 401
