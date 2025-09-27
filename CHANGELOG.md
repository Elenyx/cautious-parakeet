# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-09-27

### Added
- **Support Staff Role Management System**
  - New `/support-roles` command for administrators to manage support staff roles
  - Support for adding, removing, listing, and clearing support staff roles
  - Support staff member listing functionality
  - Role validation to ensure proper hierarchy and permissions

- **Enhanced Permission System**
  - New `isSupportStaffOnly()` method to check support staff roles (excluding administrators)
  - New `hasSupportStaffPermissions()` method for unified permission checking
  - New `getSupportStaffMembers()` method to retrieve all support staff members
  - New `isSupportRole()` method to validate configured support roles

- **Granular Command Permissions**
  - `/stats export` now requires Administrator permissions (was Support Staff + Manage Channels)
  - `/stats user` now requires Administrator permissions (was Support Staff + Manage Channels)
  - Context menu commands (`User Info`, `Message Info`) now properly check support staff roles
  - Clear permission hierarchy: Administrator > Support Staff > Regular Users

### Changed
- **Permission Structure**
  - Updated stats command to use role-based permissions instead of just Discord permissions
  - Enhanced context menu commands to properly validate support staff roles
  - Improved permission checking consistency across all commands

- **Help Documentation**
  - Updated help system to reflect new permission structure
  - Added documentation for new `/support-roles` command
  - Clarified permission requirements for different command categories
  - Updated administrator and support staff role descriptions

### Security
- **Enhanced Access Control**
  - Sensitive operations (data export, individual user statistics) now restricted to administrators only
  - Support staff can access general statistics and ticket management without administrative privileges
  - Role-based permissions provide better security than permission-based access alone

### Technical Improvements
- **Code Quality**
  - Added comprehensive error handling for role management operations
  - Improved async/await usage in permission checking methods
  - Enhanced validation for support role configuration
  - Better separation of concerns between permission levels

## [1.1.0] - Previous Release

### Added
- Initial ticket system implementation
- Basic command structure
- Database integration
- Setup wizard functionality

### Changed
- Core system architecture improvements

## [1.0.0] - Initial Release

### Added
- Basic Discord bot functionality
- Ticket system foundation
- Database schema
- Core utilities and helpers

---

## Version History

- **v1.2.0** - Support Staff Role Management & Enhanced Permissions (2025-09-27)
- **v1.1.0** - Core Ticket System Implementation
- **v1.0.0** - Initial Release

## Migration Guide

### For Administrators
1. Use the new `/support-roles` command to configure your support staff roles
2. Existing support staff will need to be assigned the configured roles
3. Review and update your permission structure as needed

### For Support Staff
- You can now access ticket statistics and management features with your assigned support role
- Some sensitive features (like data export) are now restricted to administrators only
- Use `/help permissions` to understand the new permission structure

### Breaking Changes
- `/stats export` and `/stats user` now require Administrator permissions
- Support staff roles must be explicitly configured using `/support-roles` command
- Context menu commands now validate support staff roles in addition to Discord permissions

---

*This changelog follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/) standards.*
