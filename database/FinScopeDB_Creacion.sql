-- Script de creación de base de datos para FinScope
-- Proyecto de Análisis Financiero

-- Crear la base de datos
CREATE DATABASE FinScopeDB;
GO

-- Usar la base de datos
USE FinScopeDB;
GO

-- Crear tabla de roles
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Crear tabla de usuarios
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    RoleId INT NOT NULL DEFAULT 1, -- 1 = Usuario, 2 = Administrador
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    IsVerified BIT DEFAULT 0,
    LastLoginAt DATETIME2 NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Crear tabla de códigos de verificación
CREATE TABLE VerificationCodes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Code NVARCHAR(6) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Crear tabla de categorías
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL, -- NULL para categorías por defecto del sistema
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('ingreso', 'gasto')),
    Color NVARCHAR(7) NOT NULL, -- Formato hexadecimal #RRGGBB
    IsDefault BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Crear tabla de transacciones
CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('ingreso', 'gasto')),
    CategoryId INT NOT NULL,
    Description NVARCHAR(500) NULL,
    TransactionDate DATE NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Crear tabla de archivos procesados
CREATE TABLE ProcessedFiles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(10) NOT NULL CHECK (FileType IN ('pdf', 'xlsx', 'xls')),
    FileSize BIGINT NOT NULL,
    OriginalData NVARCHAR(MAX) NULL, -- Datos extraídos del archivo
    AnalysisResults NVARCHAR(MAX) NULL, -- Resultados del análisis en JSON
    ChartsData NVARCHAR(MAX) NULL, -- Datos de gráficos en base64
    ProcessedAt DATETIME2 DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'processing' CHECK (Status IN ('processing', 'completed', 'error')),
    ErrorMessage NVARCHAR(500) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Crear tabla de sesiones de usuario
CREATE TABLE UserSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(500) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_VerificationCodes_UserId ON VerificationCodes(UserId);
CREATE INDEX IX_VerificationCodes_Code ON VerificationCodes(Code);
CREATE INDEX IX_Categories_UserId ON Categories(UserId);
CREATE INDEX IX_Transactions_UserId ON Transactions(UserId);
CREATE INDEX IX_Transactions_TransactionDate ON Transactions(TransactionDate);
CREATE INDEX IX_Transactions_CategoryId ON Transactions(CategoryId);
CREATE INDEX IX_ProcessedFiles_UserId ON ProcessedFiles(UserId);
CREATE INDEX IX_ProcessedFiles_ProcessedAt ON ProcessedFiles(ProcessedAt);
CREATE INDEX IX_ProcessedFiles_Status ON ProcessedFiles(Status);
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
CREATE INDEX IX_UserSessions_Token ON UserSessions(Token);

-- Insertar roles por defecto
INSERT INTO Roles (Name, Description) VALUES
('Usuario', 'Usuario estándar con acceso a funcionalidades básicas del sistema'),
('Administrador', 'Administrador con acceso completo al sistema incluyendo gestión de usuarios');

-- Insertar categorías por defecto del sistema
INSERT INTO Categories (UserId, Name, Type, Color, IsDefault) VALUES
(NULL, 'Alimentación', 'gasto', '#3b82f6', 1),
(NULL, 'Transporte', 'gasto', '#10b981', 1),
(NULL, 'Entretenimiento', 'gasto', '#f59e0b', 1),
(NULL, 'Servicios', 'gasto', '#ef4444', 1),
(NULL, 'Salario', 'ingreso', '#10b981', 1),
(NULL, 'Freelance', 'ingreso', '#8b5cf6', 1),
(NULL, 'Inversiones', 'ingreso', '#06b6d4', 1),
(NULL, 'Otros', 'ingreso', '#84cc16', 1);

-- Crear procedimiento almacenado para limpiar códigos expirados
CREATE PROCEDURE CleanupExpiredCodes
AS
BEGIN
    DELETE FROM VerificationCodes 
    WHERE ExpiresAt < GETDATE() OR IsUsed = 1;
END;
GO

-- Crear procedimiento almacenado para limpiar sesiones expiradas
CREATE PROCEDURE CleanupExpiredSessions
AS
BEGIN
    DELETE FROM UserSessions 
    WHERE ExpiresAt < GETDATE();
END;
GO

-- Crear job para limpiar datos expirados (opcional, para producción)
-- Puedes configurar esto en SQL Server Agent para que se ejecute cada hora

-- ========================================
-- SCRIPT DE ACTUALIZACIÓN PARA BASES DE DATOS EXISTENTES
-- ========================================
-- Este script verifica y actualiza bases de datos existentes con el sistema de roles

-- Crear tabla de roles si no existe (para bases de datos existentes)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Tabla Roles creada.';
END
ELSE
BEGIN
    PRINT 'Tabla Roles ya existe.';
END
GO

-- Insertar roles por defecto si no existen
IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Usuario')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES
    ('Usuario', 'Usuario estándar con acceso a funcionalidades básicas del sistema');
    PRINT 'Rol Usuario insertado.';
END
ELSE
BEGIN
    PRINT 'Rol Usuario ya existe.';
END
GO

IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Administrador')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES
    ('Administrador', 'Administrador con acceso completo al sistema incluyendo gestión de usuarios');
    PRINT 'Rol Administrador insertado.';
END
ELSE
BEGIN
    PRINT 'Rol Administrador ya existe.';
END
GO

-- Agregar columna RoleId a la tabla Users si no existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'RoleId')
BEGIN
    ALTER TABLE Users ADD RoleId INT NOT NULL DEFAULT 1;
    PRINT 'Columna RoleId agregada a tabla Users.';
END
ELSE
BEGIN
    PRINT 'Columna RoleId ya existe en tabla Users.';
END
GO

-- Agregar foreign key constraint si no existe
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Users_Roles')
BEGIN
    ALTER TABLE Users ADD CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id);
    PRINT 'Foreign key FK_Users_Roles agregada.';
END
ELSE
BEGIN
    PRINT 'Foreign key FK_Users_Roles ya existe.';
END
GO

-- Actualizar usuarios existentes para que tengan rol de Usuario (ID = 1)
UPDATE Users SET RoleId = 1 WHERE RoleId IS NULL OR RoleId = 0;
PRINT 'Usuarios existentes actualizados con rol de Usuario.';
GO

PRINT 'Base de datos FinScopeDB creada/actualizada exitosamente con todas las tablas y datos iniciales.';
PRINT 'Sistema de roles implementado correctamente.';
GO
