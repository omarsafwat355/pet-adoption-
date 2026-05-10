IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [IsApproved] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Pets] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Age] int NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Breed] nvarchar(max) NOT NULL,
    [Gender] nvarchar(max) NOT NULL,
    [HealthStatus] nvarchar(max) NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [OwnerId] int NOT NULL,
    CONSTRAINT [PK_Pets] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Pets_Users_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AdoptionRequests] (
    [Id] int NOT NULL IDENTITY,
    [Message] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [PetId] int NOT NULL,
    [AdopterId] int NOT NULL,
    CONSTRAINT [PK_AdoptionRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AdoptionRequests_Pets_PetId] FOREIGN KEY ([PetId]) REFERENCES [Pets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AdoptionRequests_Users_AdopterId] FOREIGN KEY ([AdopterId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Favorites] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [PetId] int NOT NULL,
    CONSTRAINT [PK_Favorites] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Favorites_Pets_PetId] FOREIGN KEY ([PetId]) REFERENCES [Pets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Favorites_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Images] (
    [Id] int NOT NULL IDENTITY,
    [Url] nvarchar(max) NOT NULL,
    [PetId] int NOT NULL,
    CONSTRAINT [PK_Images] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Images_Pets_PetId] FOREIGN KEY ([PetId]) REFERENCES [Pets] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Reviews] (
    [Id] int NOT NULL IDENTITY,
    [Rating] int NOT NULL,
    [Comment] nvarchar(max) NOT NULL,
    [UserId] int NOT NULL,
    [PetId] int NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_Pets_PetId] FOREIGN KEY ([PetId]) REFERENCES [Pets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_AdoptionRequests_AdopterId] ON [AdoptionRequests] ([AdopterId]);
GO

CREATE INDEX [IX_AdoptionRequests_PetId] ON [AdoptionRequests] ([PetId]);
GO

CREATE INDEX [IX_Favorites_PetId] ON [Favorites] ([PetId]);
GO

CREATE INDEX [IX_Favorites_UserId] ON [Favorites] ([UserId]);
GO

CREATE INDEX [IX_Images_PetId] ON [Images] ([PetId]);
GO

CREATE INDEX [IX_Pets_OwnerId] ON [Pets] ([OwnerId]);
GO

CREATE INDEX [IX_Reviews_PetId] ON [Reviews] ([PetId]);
GO

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260510122854_InitialCreate', N'8.0.0');
GO

COMMIT;
GO

