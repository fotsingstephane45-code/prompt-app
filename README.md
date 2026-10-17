# api-http-<prénom>

Client d'API HTTP typé pour l'API JSONPlaceholder, illustrant la POO en
Python : dataclasses, hiérarchie d'exceptions, encapsulation des appels
réseau.

## Installation

```bash
python -m venv .venv
source .venv/bin/activate          # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

## Lancer le script de vérification

```bash
python src/client_api.py
```

Nécessite une connexion Internet (interroge la vraie API
`https://jsonplaceholder.typicode.com`).

## Vérifier le typage

```bash
mypy src/
```
