from typing import Dict, Any, Union
from datetime import datetime

class MongoDBParser:
    """Utilidades para parsear formato de MongoDB"""
    
    @staticmethod
    def parse_date(date_dict: Dict[str, Any]) -> Union[float, datetime]:
        """
        Convierte formato de fecha de MongoDB a timestamp o datetime
        
        Args:
            date_dict: Diccionario con formato MongoDB date
            
        Returns:
            Timestamp en segundos o datetime object
        """
        try:
            if '$date' in date_dict:
                date_info = date_dict['$date']
                
                # Manejar diferentes formatos de número
                if '$numberLong' in date_info:
                    timestamp_ms = float(date_info['$numberLong'])
                elif '$numberInt' in date_info:
                    timestamp_ms = float(date_info['$numberInt'])
                elif '$numberDouble' in date_info:
                    timestamp_ms = float(date_info['$numberDouble'])
                else:
                    return 0.0
                
                # Convertir de milisegundos a segundos
                timestamp_seconds = timestamp_ms / 1000
                
                # Opcional: convertir a datetime
                # return datetime.fromtimestamp(timestamp_seconds)
                
                return timestamp_seconds
            return 0.0
        except Exception as e:
            print(f"Error parseando fecha: {e}")
            return 0.0
    
    @staticmethod
    def parse_number(number_dict: Dict[str, Any]) -> float:
        """
        Convierte formato de número de MongoDB a float
        
        Args:
            number_dict: Diccionario con formato MongoDB number
            
        Returns:
            Número como float
        """
        try:
            if isinstance(number_dict, (int, float)):
                return float(number_dict)
            
            if '$numberInt' in number_dict:
                return float(number_dict['$numberInt'])
            elif '$numberLong' in number_dict:
                return float(number_dict['$numberLong'])
            elif '$numberDouble' in number_dict:
                return float(number_dict['$numberDouble'])
            else:
                return 0.0
        except Exception as e:
            print(f"Error parseando número: {e}")
            return 0.0
    
    @staticmethod
    def parse_object_id(oid_dict: Dict[str, Any]) -> str:
        """
        Convierte formato ObjectId de MongoDB a string
        
        Args:
            oid_dict: Diccionario con formato MongoDB ObjectId
            
        Returns:
            String del ObjectId
        """
        try:
            if '$oid' in oid_dict:
                return str(oid_dict['$oid'])
            elif isinstance(oid_dict, str):
                return oid_dict
            else:
                return str(oid_dict)
        except Exception as e:
            print(f"Error parseando ObjectId: {e}")
            return str(oid_dict)
    
    @staticmethod
    def convert_session_data(session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convierte una sesión completa del formato MongoDB al formato estándar
        
        Args:
            session_data: Sesión en formato MongoDB
            
        Returns:
            Sesión en formato estándar
        """
        try:
            converted = {
                "userId": session_data.get("userId", ""),
                "date": MongoDBParser.parse_date(session_data.get("date", {})),
                "startTime": MongoDBParser.parse_date(session_data.get("startTime", {})),
                "endTime": MongoDBParser.parse_date(session_data.get("endTime", {})),
                "totalDuration": MongoDBParser.parse_number(session_data.get("totalDuration", 0)),
                "totalRestTime": MongoDBParser.parse_number(session_data.get("totalRestTime", 0)),
                "totalSets": MongoDBParser.parse_number(session_data.get("totalSets", 0)),
                "exercises": session_data.get("exercises", []),
                "statistics": session_data.get("statistics", {}),
                "createdAt": MongoDBParser.parse_date(session_data.get("createdAt", {})),
                "updatedAt": MongoDBParser.parse_date(session_data.get("updatedAt", {}))
            }
            
            # Procesar ObjectId si existe
            if "_id" in session_data:
                converted["_id"] = MongoDBParser.parse_object_id(session_data["_id"])
            
            return converted
            
        except Exception as e:
            print(f"Error convirtiendo sesión: {e}")
            return session_data 