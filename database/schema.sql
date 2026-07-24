-- ============================================
-- روايتك - Database Schema
-- SQL Server Database
-- ============================================

CREATE DATABASE RiwayatekDB;
GO

USE RiwayatekDB;
GO

-- Users Table
CREATE TABLE [Users] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL,
    [Email] NVARCHAR(200) NOT NULL,
    [Phone] NVARCHAR(20),
    [PasswordHash] NVARCHAR(500) NOT NULL,
    [Role] NVARCHAR(20) NOT NULL DEFAULT 'user',
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2
);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

-- BookTypes Table
CREATE TABLE [BookTypes] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL,
    [NameAr] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX),
    [DescriptionAr] NVARCHAR(MAX),
    [Icon] NVARCHAR(50),
    [Price] DECIMAL(18,2) NOT NULL,
    [MinPages] INT NOT NULL DEFAULT 20,
    [MaxPages] INT NOT NULL DEFAULT 30,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Orders Table
CREATE TABLE [Orders] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [OrderNumber] NVARCHAR(50) NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [BookTypeId] UNIQUEIDENTIFIER NOT NULL,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'pending_payment',
    [TotalAmount] DECIMAL(18,2) NOT NULL,
    [CharacterName] NVARCHAR(200) NOT NULL,
    [Age] INT,
    [Nationality] NVARCHAR(100),
    [Hobbies] NVARCHAR(MAX),
    [Qualities] NVARCHAR(MAX),
    [Memories] NVARCHAR(MAX),
    [StoryType] NVARCHAR(200),
    [StoryGoal] NVARCHAR(500),
    [ClientMessage] NVARCHAR(MAX),
    [Images] NVARCHAR(MAX),
    [ShippingFullName] NVARCHAR(200) NOT NULL,
    [ShippingPhone] NVARCHAR(20) NOT NULL,
    [ShippingCity] NVARCHAR(100) NOT NULL,
    [ShippingDistrict] NVARCHAR(100),
    [ShippingStreet] NVARCHAR(200),
    [ShippingBuildingNumber] NVARCHAR(50),
    [ShippingAdditionalDetails] NVARCHAR(500),
    [TransactionNumber] NVARCHAR(9),
    [PaymentProofUrl] NVARCHAR(500),
    [RejectionReason] NVARCHAR(MAX),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    CONSTRAINT [FK_Orders_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
    CONSTRAINT [FK_Orders_BookTypes] FOREIGN KEY ([BookTypeId]) REFERENCES [BookTypes]([Id])
);
GO

CREATE UNIQUE INDEX [IX_Orders_OrderNumber] ON [Orders] ([OrderNumber]);
GO
CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
GO
CREATE INDEX [IX_Orders_Status] ON [Orders] ([Status]);
GO

-- OrderTimelines Table
CREATE TABLE [OrderTimelines] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [OrderId] UNIQUEIDENTIFIER NOT NULL,
    [Status] NVARCHAR(50) NOT NULL,
    [Date] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [Note] NVARCHAR(MAX),
    CONSTRAINT [FK_OrderTimelines_Orders] FOREIGN KEY ([OrderId]) REFERENCES [Orders]([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_OrderTimelines_OrderId] ON [OrderTimelines] ([OrderId]);
GO

-- ContactMessages Table
CREATE TABLE [ContactMessages] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL,
    [Email] NVARCHAR(200) NOT NULL,
    [Phone] NVARCHAR(20),
    [Subject] NVARCHAR(500) NOT NULL,
    [Message] NVARCHAR(MAX) NOT NULL,
    [IsRead] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- GalleryItems Table
CREATE TABLE [GalleryItems] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [ImageUrl] NVARCHAR(500) NOT NULL,
    [Title] NVARCHAR(200) NOT NULL,
    [TitleAr] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX),
    [DescriptionAr] NVARCHAR(MAX),
    [BookType] NVARCHAR(100),
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- FAQs Table
CREATE TABLE [FAQs] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Question] NVARCHAR(500) NOT NULL,
    [QuestionAr] NVARCHAR(500) NOT NULL,
    [Answer] NVARCHAR(MAX) NOT NULL,
    [AnswerAr] NVARCHAR(MAX) NOT NULL,
    [Order] INT NOT NULL DEFAULT 0,
    [IsActive] BIT NOT NULL DEFAULT 1
);
GO

-- SiteSettings Table
CREATE TABLE [SiteSettings] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Key] NVARCHAR(100) NOT NULL,
    [Value] NVARCHAR(MAX) NOT NULL
);
GO

CREATE UNIQUE INDEX [IX_SiteSettings_Key] ON [SiteSettings] ([Key]);
GO

-- ============================================
-- Seed Data
-- ============================================

-- Admin User (email: kosaialasalh1@gmail.com, password: oday2001#)
-- BCrypt hash for 'oday2001#'
INSERT INTO [Users] ([Id], [Name], [Email], [Phone], [PasswordHash], [Role])
VALUES (NEWID(), N'مدير النظام', N'kosaialasalh1@gmail.com', N'0990000000',
N'$2a$11$8L0qYX5RQ0qYX5RQ0qYX5eH8L0qYX5RQ0qYX5RQ0qYX5RQ0qYX5e', N'admin');
GO

-- Book Types
INSERT INTO [BookTypes] ([Id], [Name], [NameAr], [Description], [DescriptionAr], [Icon], [Price], [MinPages], [MaxPages])
VALUES
(NEWID(), 'Childhood Story', N'قصة طفولة', 'Document childhood memories in a beautiful book', N'وثق ذكريات الطفولة في كتاب جميل', '👶', 150, 20, 30),
(NEWID(), 'Youth Story', N'قصة شباب', 'Document youth achievements and ambitions', N'سجل مرحلة الشباب والإنجازات', '🌟', 150, 20, 30),
(NEWID(), 'Graduation Story', N'قصة تخرج', 'The journey of success from first day to graduation', N'رحلة النجاح من أول يوم دراسي حتى التخرج', '🎓', 175, 25, 35),
(NEWID(), 'Success Story', N'قصة نجاح', 'Inspiring career journey and achievements', N'سرد ملهم لرحلتك المهنية وإنجازاتك', '🏆', 200, 30, 40),
(NEWID(), 'Love Story', N'قصة حب', 'Beautiful love story in a luxury book', N'أجمل مشاعر الحب والرومانسية في كتاب فاخر', '💕', 175, 20, 30),
(NEWID(), 'Travel Story', N'قصة رحلة', 'Travel memories and adventures around the world', N'أجمل ذكريات أسفارك ومغامراتك حول العالم', '✈️', 200, 30, 40),
(NEWID(), 'Biography', N'سيرة ذاتية', 'Professional biography in an inspiring story', N'سيرتك المهنية بقصة ملهمة', '💼', 250, 40, 50),
(NEWID(), 'Custom Gift', N'هدية مخصصة', 'Unique gift for special people', N'هدية فريدة ومميزة لأعز الناس', '🎁', 150, 20, 30),
(NEWID(), 'Family Story', N'قصة عائلة', 'Family history and ancestors stories', N'تاريخ عائلتك وقصص الأجداد', '👨‍👩‍👧‍👦', 250, 40, 60),
(NEWID(), 'Custom Story', N'قصة مخصصة', 'Any other story you want to immortalize', N'أي قصة أخرى تريد تخليدها', '✨', 200, 25, 40);
GO

-- FAQs
INSERT INTO [FAQs] ([Id], [Question], [QuestionAr], [Answer], [AnswerAr], [Order], [IsActive])
VALUES
(NEWID(), 'What is Riwayatek?', N'ما هي روايتك؟', 'Riwayatek is a platform that turns real people stories into printed books.', N'روايتك هي منصة إلكترونية لتحويل القصص إلى كتب مطبوعة فاخرة.', 1, 1),
(NEWID(), 'How long does it take?', N'كم يستغرق وقت إنتاج الكتاب؟', 'Production takes 7-14 business days after payment confirmation.', N'يستغرق الإنتاج من ٧ إلى ١٤ يوم عمل بعد تأكيد الدفع.', 2, 1),
(NEWID(), 'What payment methods?', N'ما هي طرق الدفع؟', 'Payment is exclusively via Sham Cash wallet.', N'الدفع حصراً عبر محفظة شام كاش.', 3, 1),
(NEWID(), 'Do you ship internationally?', N'هل تشحنون خارج المملكة؟', 'Yes, we ship to all countries worldwide.', N'نعم، نشحن إلى جميع دول العالم.', 4, 1);
GO

-- Site Settings
INSERT INTO [SiteSettings] ([Id], [Key], [Value])
VALUES
(NEWID(), 'SiteName', 'روايتك'),
(NEWID(), 'SiteDescription', 'لأن لكل إنسان قصة تستحق أن تُروى'),
(NEWID(), 'ContactEmail', 'info@riwayatek.com'),
(NEWID(), 'ContactPhone', '+966 55 123 4567'),
(NEWID(), 'ShamCashWallet', '0991234567'),
(NEWID(), 'ShamCashBeneficiary', 'روايتك');
GO
