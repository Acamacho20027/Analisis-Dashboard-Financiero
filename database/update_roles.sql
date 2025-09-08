-- Script de actualización para agregar sistema de roles
-- Ejecutar este script en la base de datos existente

USE FinScopeDB;
GO

-- Crear tabla de roles si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Insertar roles por defecto si no existen
IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Usuario')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES
    ('Usuario', 'Usuario estándar con acceso a funcionalidades básicas del sistema');
END
GO

IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Administrador')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES
    ('Administrador', 'Administrador con acceso completo al sistema incluyendo gestión de usuarios');
END
GO

-- Agregar columna RoleId a la tabla Users si no existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'RoleId')
BEGIN
    ALTER TABLE Users ADD RoleId INT NOT NULL DEFAULT 1;
END
GO

-- Agregar foreign key constraint si no existe
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Users_Roles')
BEGIN
    ALTER TABLE Users ADD CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id);
END
GO

-- Actualizar usuarios existentes para que tengan rol de Usuario (ID = 1)
UPDATE Users SET RoleId = 1 WHERE RoleId IS NULL OR RoleId = 0;
GO

PRINT 'Sistema de roles actualizado exitosamente.';
GO
