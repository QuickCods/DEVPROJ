ALTER TABLE dbo.Users
ADD
  Balance   decimal(18,2) NOT NULL CONSTRAINT DF_Users_Balance   DEFAULT(0),
  IsDeleted bit           NOT NULL CONSTRAINT DF_Users_IsDeleted DEFAULT(0);
