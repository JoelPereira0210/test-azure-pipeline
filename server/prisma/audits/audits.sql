-- Enable the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the audit table
CREATE TABLE public.AuditLog (
    logID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tableName VARCHAR(255) NOT NULL,
    rowID UUID NOT NULL,
    actionType VARCHAR(50) NOT NULL,
    columnID VARCHAR(255),
    oldValue TEXT,
    newValue TEXT,
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actionBy UUID NOT NULL
);

-- Create the audit function
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERTs
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.AuditLog (tableName, rowID, actionType, newValue, actionBy)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW)::text, current_user::uuid);
        RETURN NEW;
    END IF;

    -- Handle UPDATEs
    IF (TG_OP = 'UPDATE') THEN
        -- Log each column change
        PERFORM pg_sleep(0.1);  -- Adding delay to avoid race conditions (optional)
        INSERT INTO public.AuditLog (tableName, rowID, actionType, columnID, oldValue, newValue, actionBy)
        SELECT TG_TABLE_NAME, NEW.id, 'UPDATE', column_name,
               OLD.column_name::text, NEW.column_name::text, current_user::uuid
        FROM information_schema.columns
        WHERE table_name = TG_TABLE_NAME
        AND column_name NOT IN ('id');
        RETURN NEW;
    END IF;

    -- Handle DELETEs
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.AuditLog (tableName, rowID, actionType, oldValue, actionBy)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD)::text, current_user::uuid);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for User table
CREATE TRIGGER audit_trigger_user
AFTER INSERT OR UPDATE OR DELETE ON public."User"
FOR EACH ROW EXECUTE FUNCTION public.log_audit();

-- Create triggers for other tables similarly
