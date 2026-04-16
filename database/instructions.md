1. Navigate into the `database` folder from the root of the repository.
2. For a fresh setup, run `mysql -u root -p < db.sql`.
3. If you already have contact data and want to keep it, use `database/setup_local_mysql.sh` or manually add any missing columns from `database/db.sql` instead of re-importing the whole file.
4. Enter the MySQL password when prompted.
