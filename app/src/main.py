import os
import sys
from flask import Flask, jsonify
from dotenv import load_dotenv
from supabase import create_client, Client

# Přidání cesty pro správné importy
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Načtení proměnných prostředí
load_dotenv()

# Inicializace Flask aplikace
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')

# Inicializace Supabase klienta
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Registrace blueprintů
from src.routes.auth import auth_bp
from src.routes.properties import properties_bp
from src.routes.agents import agents_bp
from src.routes.sellers import sellers_bp
from src.routes.credits import credits_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(properties_bp, url_prefix='/api/properties')
app.register_blueprint(agents_bp, url_prefix='/api/agent')
app.register_blueprint(sellers_bp, url_prefix='/api/seller')
app.register_blueprint(credits_bp, url_prefix='/api/credits')

# Základní route pro kontrolu stavu API
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'API je funkční',
        'supabase_connected': supabase is not None
    })

# Obsluha chyb
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'status': 'error',
        'message': 'Požadovaný zdroj nebyl nalezen'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Interní chyba serveru'
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
