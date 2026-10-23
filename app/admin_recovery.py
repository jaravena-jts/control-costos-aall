"""Recuperación única del administrador, activada desde el entorno del servidor."""
import base64
import hashlib
import re


def apply_admin_recovery(con, email, timestamp, environ):
    encoded = environ.get('WEBALL_ADMIN_RECOVERY_HASH', '').strip()
    if not encoded:
        return False
    parts = encoded.split('$')
    if (len(parts) != 4 or parts[0] != 'pbkdf2_sha256'
            or parts[1] != '310000'
            or not re.fullmatch(r'[A-Za-z0-9_-]{22}', parts[2])
            or not re.fullmatch(r'[A-Za-z0-9_-]{43}', parts[3])):
        raise ValueError('WEBALL_ADMIN_RECOVERY_HASH inválido. Use generar_hash.py.')
    if (len(base64.urlsafe_b64decode(parts[2] + '==')) != 16
            or len(base64.urlsafe_b64decode(parts[3] + '=')) != 32):
        raise ValueError('Formato de recuperación inválido.')
    marker = 'admin_recovery_applied_' + hashlib.sha256(encoded.encode()).hexdigest()
    if con.execute('SELECT 1 FROM settings WHERE key=?', (marker,)).fetchone():
        return False
    row = con.execute('SELECT id FROM users WHERE email=?', (email,)).fetchone()
    if row is None:
        raise ValueError('No existe el administrador principal; recuperación cancelada.')
    user_id = row[0]
    # El llamador controla la transacción: clave, sesiones y marca se guardan juntas.
    con.execute('''UPDATE users SET password_hash=?,role='admin',active=1,
                   email_verified=1,must_change_password=1,blocked_by_admin=0,
                   updated_at=? WHERE id=?''', (encoded, timestamp, user_id))
    con.execute('DELETE FROM sessions WHERE user_id=?', (user_id,))
    con.execute('DELETE FROM email_codes WHERE email=?', (email,))
    con.execute('INSERT INTO settings(key,value,updated_at,updated_by) VALUES(?,?,?,?)',
                (marker, '1', timestamp, user_id))
    return True
