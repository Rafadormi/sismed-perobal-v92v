
"""
Script de inicialização do banco de dados
Popula tabela de medicamentos com lista padrão
"""

from app import create_app
from database import db
from models import Medicine
import json

# Lista oficial de 36 medicamentos especializados
MEDICAMENTOS_PADRAO = [
    {"nome": "AMITRIPTILINA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ÁCIDO VALPROICO", "concentracao": "250MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ÁCIDO VALPROICO", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ÁCIDO VALPROICO", "concentracao": "50MG/ML", "apresentacao": "SUSPENSÃO ORAL"},
    {"nome": "BIPERIDENO CLORIDRATO", "concentracao": "2MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CARBAMAZEPINA", "concentracao": "200MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CARBAMAZEPINA", "concentracao": "20MG/ML", "apresentacao": "SUSPENSÃO"},
    {"nome": "CARBONATO DE LÍTIO", "concentracao": "300MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CLOMIPRAMINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CLONAZEPAM", "concentracao": "2MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CLONAZEPAM", "concentracao": "2.5MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"nome": "CLORPROMAZINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CLORPROMAZINA CLORIDRATO", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "DESVENLAFAXINA SUCCINATO", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "DIAZEPAM", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "DIAZEPAM", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ESCITALOPRAM", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "FENITOÍNA SÓDICA", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "FENOBARBITAL", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "FENOBARBITAL", "concentracao": "40MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"nome": "FLUOXETINA", "concentracao": "20MG", "apresentacao": "CÁPSULA/COMPRIMIDO"},
    {"nome": "HALOPERIDOL", "concentracao": "1MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "HALOPERIDOL", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "HALOPERIDOL", "concentracao": "2MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"nome": "HALOPERIDOL DECANOATO", "concentracao": "50MG/ML", "apresentacao": "SOLUÇÃO INJETÁVEL"},
    {"nome": "IMIPRAMINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "LEVOMEPROMAZINA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "LEVOMEPROMAZINA", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "MIRTAZAPINA", "concentracao": "30MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "NORTRIPTILINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "OXCARBAZEPINA", "concentracao": "600MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "OXCARBAZEPINA", "concentracao": "60MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"nome": "PAROXETINA CLORIDRATO", "concentracao": "20MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "PREGABALINA", "concentracao": "75MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "SERTRALINA CLORIDRATO", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "VENLAFAXINA CLORIDRATO", "concentracao": "75MG", "apresentacao": "COMPRIMIDO"}
]

def seed_medicines():
    """Popula tabela de medicamentos com dados padrão"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Iniciando seed de medicamentos...")
        
        # Verificar se já existem medicamentos
        existing_count = Medicine.query.count()
        if existing_count > 0:
            print(f"ℹ️  Já existem {existing_count} medicamentos cadastrados")
            return
        
        # Inserir medicamentos padrão
        inserted = 0
        for med_data in MEDICAMENTOS_PADRAO:
            try:
                # Verificar se já existe (evitar duplicatas)
                existing = Medicine.query.filter_by(
                    denominacao_generica=med_data["nome"],
                    concentracao=med_data["concentracao"],
                    apresentacao=med_data["apresentacao"]
                ).first()
                
                if not existing:
                    medicine = Medicine(
                        denominacao_generica=med_data["nome"],
                        concentracao=med_data["concentracao"],
                        apresentacao=med_data["apresentacao"]
                    )
                    db.session.add(medicine)
                    inserted += 1
            
            except Exception as e:
                print(f"❌ Erro ao inserir {med_data['nome']}: {e}")
                continue
        
        # Commit todas as inserções
        try:
            db.session.commit()
            print(f"✅ {inserted} medicamentos inseridos com sucesso!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar medicamentos: {e}")

if __name__ == "__main__":
    seed_medicines()
