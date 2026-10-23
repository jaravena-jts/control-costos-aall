"""python aplicar_parche.py RUTA_DEL_REPOSITORIO_WEB_ALL"""
from pathlib import Path
import shutil
import sys


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    target = root / 'app' / 'main.py'
    source = target.read_text(encoding='utf-8')
    anchor = '        ts = now_iso()\n        updater = con.execute("SELECT * FROM users WHERE email=?", (UPDATER_EMAIL,)).fetchone()'
    addition = ('        from .admin_recovery import apply_admin_recovery\n'
                '        apply_admin_recovery(con, ADMIN_EXCEPTION, now_iso(), os.environ)\n\n')
    if 'apply_admin_recovery(con, ADMIN_EXCEPTION' in source:
        print('El parche ya está instalado. No se hicieron cambios.')
        return
    if source.count(anchor) != 1 or 'ADMIN_EXCEPTION = "javier.aravena@usach.cl"' not in source:
        raise SystemExit('Esta versión no coincide con Web ALL revisada. No se modificó ningún archivo.')
    changed = source.replace(anchor, addition + anchor, 1)
    compile(changed, str(target), 'exec')
    backup = target.with_suffix('.py.antes_recuperacion.bak')
    if backup.exists():
        raise SystemExit('Ya existe un respaldo. Revíselo antes de volver a aplicar.')
    shutil.copy2(target, backup)
    shutil.copy2(Path(__file__).parent / 'app' / 'admin_recovery.py', root / 'app' / 'admin_recovery.py')
    target.write_text(changed, encoding='utf-8')
    print('Parche aplicado. Publique app/main.py y app/admin_recovery.py. No publique el respaldo.')


if __name__ == '__main__':
    main()
