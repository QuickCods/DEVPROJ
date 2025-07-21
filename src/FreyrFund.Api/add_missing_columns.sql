-- Adicionar colunas Balance e IsDeleted à tabela Users
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'Balance')
BEGIN
    ALTER TABLE [Users] ADD [Balance] decimal(18,2) NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'IsDeleted')
BEGIN
    ALTER TABLE [Users] ADD [IsDeleted] bit NOT NULL DEFAULT 0;
END
