CREATE SCHEMA IF NOT EXISTS bank AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS bank.account
(
    account_id            INTEGER PRIMARY KEY,
    person_id             INTEGER NOT NULL,
    balance               INTEGER NOT NULL DEFAULT 0,
    daily_withdrawl_limit INTEGER,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    account_type          VARCHAR NOT NULL,
    create_date           TIMESTAMPTZ      DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank.transaction
(
    transaction_id   VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type VARCHAR NOT NULL,
    account_id       INTEGER NOT NULL,
    value            INTEGER NOT NULL,
    transaction_date TIMESTAMPTZ         DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank.person
(
    person_id  INTEGER PRIMARY KEY,
    name       VARCHAR NOT NULL,
    document   VARCHAR NOT NULL,
    birth_date TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION bank.create_account(person_id_in INTEGER, account_type_in VARCHAR) RETURNS VOID
    LANGUAGE plpgsql
AS
$$
BEGIN
    RAISE INFO 'Creating new account for person with id: [%]', person_id_in;
    INSERT INTO bank.account(account_id, person_id, daily_withdrawl_limit, account_type)
    VALUES ((SELECT COALESCE(MAX(account_id), 0) + 1 FROM bank.account),
            person_id_in,
            FLOOR(RANDOM() * 5000 + 1)::INTEGER,
            account_type_in);
END;
$$;

CREATE OR REPLACE FUNCTION bank.account_transaction(account_id_in INTEGER,
                                                    action_value INTEGER,
                                                    transaction_type_in VARCHAR) RETURNS VOID
    LANGUAGE plpgsql
AS
$$
BEGIN
    RAISE INFO 'Making a % for account with id: [%] with the value of [%]', transaction_type_in, account_id_in, action_value;

    INSERT INTO bank.transaction(account_id, transaction_type, value)
    VALUES (account_id_in, transaction_type_in, action_value);

    UPDATE bank.account
    SET balance = CASE
                      WHEN transaction_type_in = 'deposit' THEN balance + action_value
                      WHEN transaction_type_in = 'withdraw' THEN balance - action_value END
    WHERE account_id = account_id_in;
END;
$$;

CREATE OR REPLACE FUNCTION bank.block_account(account_id_in INTEGER) RETURNS VOID
    LANGUAGE plpgsql
AS
$$
BEGIN
    RAISE INFO 'Blocking account with id: [%]', account_id_in;
    UPDATE bank.account
    SET is_active = FALSE
    WHERE account_id = account_id_in;
END;
$$;

CREATE OR REPLACE FUNCTION bank.get_account_transactions(account_id_in INTEGER)
    RETURNS TABLE
            (
                transaction_id   VARCHAR,
                transaction_type VARCHAR,
                account_id       INTEGER,
                value            INTEGER,
                transaction_date TIMESTAMPTZ
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RAISE INFO 'Getting all the transactions of account with id: [%]', account_id_in;

    RETURN QUERY SELECT transaction.transaction_id,
                        transaction.transaction_type,
                        transaction.account_id,
                        transaction.value,
                        transaction.transaction_date
                 FROM bank.transaction transaction
                 WHERE transaction.account_id = account_id_in;
END;
$$;

INSERT INTO bank.person(person_id, name, document, birth_date)
VALUES (1, 'Tomer', 'Israeli Citizen', '2000-01-25'::timestamptz)
ON CONFLICT DO NOTHING;