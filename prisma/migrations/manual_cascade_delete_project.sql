-- Drop all tasks related to the project
DELETE FROM "Task" WHERE "projectId" = $1;
-- Drop all memberships related to the project
DELETE FROM "Membership" WHERE "projectId" = $1;
-- Now you can safely delete the project
DELETE FROM "Project" WHERE "id" = $1;
