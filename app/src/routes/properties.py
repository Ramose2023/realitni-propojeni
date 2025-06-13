from flask import Blueprint, request, jsonify
from src.services.property_service import create_property, get_properties, get_property, update_property, delete_property

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/properties', methods=['POST'])
def create_property_route():
    data = request.get_json()
    result = create_property(data)
    return jsonify(result), 201

@properties_bp.route('/properties', methods=['GET'])
def get_properties_route():
    properties = get_properties()
    return jsonify(properties), 200

@properties_bp.route('/properties/<id>', methods=['GET'])
def get_property_route(id):
    property = get_property(id)
    return jsonify(property), 200

@properties_bp.route('/properties/<id>', methods=['PUT'])
def update_property_route(id):
    data = request.get_json()
    result = update_property(id, data)
    return jsonify(result), 200

@properties_bp.route('/properties/<id>', methods=['DELETE'])
def delete_property_route(id):
    result = delete_property(id)
    return jsonify(result), 200