"""Ejecutar en su equipo: la contraseña se introduce sin mostrarse."""
import base64
import getpass
import hashlib
import re
import secrets


def main():
    password = getpass.getpass('Clave temporal (6 a 10 caracteres, letras y números): ')
    if not (re.fullmatch(r'[A-Za-z0-9]{6,10}', password)
            and re.search(r'[A-Za-z]', password) and re.search(r'\d', password)):
        raise SystemExit('Use entre 6 y 10 caracteres, con letras y números (regla actual de la web).')
    if password != getpass.getpass('Repita la clave temporal: '):
        raise SystemExit('Las claves no coinciden.')
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 310000)
    enc = lambda b: base64.urlsafe_b64encode(b).decode().rstrip('=')
    print('\nNombre de la variable en Railway: WEBALL_ADMIN_RECOVERY_HASH')
    print('Valor (copie completo, incluidos los signos $):')
    print(f'pbkdf2_sha256$310000${enc(salt)}${enc(digest)}')
    print('\nLa clave no se ha guardado ni enviado. Conserve el hash en privado.')


if __name__ == '__main__':
    main()
