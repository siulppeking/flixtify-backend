const User = require('../models/User');
const TwoFAMethod = require('../models/TwoFAMethod');
const httpStatus = require('../constants/httpStatus');
const errorMessages = require('../constants/errorMessages');
const apiMessages = require('../constants/apiMessages');
const dbFields = require('../constants/dbFields');
const errorHandler = require('../utils/errorHandler');

const USER_PROJECTION = '-password -twoFAVerifiedSession';

const isSameUser = (requestingUserId, targetUserId) => {
  return requestingUserId.toString() === targetUserId.toString();
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, userPreferences } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: errorMessages.EMAIL_ALREADY_EXISTS });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      userPreferences
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(httpStatus.CREATED).json({
      message: apiMessages.USER_MESSAGES.CREATED,
      user: userResponse
    });
  } catch (error) {
    const errorResponse = errorHandler.handleControllerError(error, 'Error creating user');
    errorHandler.sendErrorResponse(res, errorResponse);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false })
      .select(USER_PROJECTION)
      .sort({ createdAt: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const requestingUserId = req.user.id;

    const user = await User.findOne({ _id: userId, deleted: false })
      .select(USER_PROJECTION);

    if (!user) {
      return res.status(404).json({ message: 'User not found or deleted' });
    }

    if (!isSameUser(requestingUserId, userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const requestingUserId = req.user.id;
    const updates = req.body;

    if (!isSameUser(requestingUserId, userId)) {
      return res.status(403).json({ message: 'Access denied to update this profile' });
    }

    // 1. Evitar que se actualicen campos sensibles directamente
    delete updates.password;
    delete updates.twoFAEnabled;
    delete updates.twoFAVerifiedSession;
    delete updates.loginAttempts;
    delete updates.deleted;

    // 2. Actualizar el usuario
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, deleted: false },
      updates,
      { new: true, runValidators: true }
    ).select(USER_PROJECTION);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado o acceso denegado.' });
    }

    res.json({
      message: 'Usuario actualizado con éxito.',
      user: updatedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Nombre de usuario o correo ya en uso.' });
    }
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar usuario.' });
  }
};

// DELETE /api/users/:id (Soft Delete - Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // 1. Marcar el usuario como eliminado y deshabilitado
    const deletedUser = await User.findOneAndUpdate(
      { _id: userId, deleted: false },
      { deleted: true, enabled: false },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado o ya eliminado.' });
    }

    // 2. Deshabilitar/Eliminar métodos 2FA asociados (Soft Delete)
    await TwoFAMethod.updateMany(
      { userId: userId, deleted: false },
      { deleted: true, isEnabled: false }
    );

    res.json({ message: 'Usuario y sus métodos 2FA asociados marcados como eliminados con éxito.' });
  } catch (error) {
    console.error('Error marcando usuario como eliminado:', error);
    res.status(500).json({ message: 'Error del servidor al marcar usuario como eliminado.' });
  }
};

// -------------------------------------------------------------------
// --- Funciones de Gestión de 2FA (Usando TwoFAMethod) ---
// -------------------------------------------------------------------

// POST /api/users/2fa/enroll/totp
exports.enrollTOTP = async (req, res) => {
    try {
        const userId = req.user.id;

        // TODO: Lógica REAL: Generar un nuevo secreto TOTP usando speakeasy.
        const tempSecret = 'EJEMPLO_SECRET_BASE32';

        // 1. Crear el nuevo método (sin verificar ni habilitar)
        const newMethod = await TwoFAMethod.create({
            userId: userId,
            methodType: 'TOTP',
            secret: tempSecret,
            isEnabled: false,
            isVerified: false
        });

        // TODO: Lógica REAL: Generar el QR code URL usando speakeasy.
        const qrCodeUrl = `otpauth://totp/App:${req.user.email}?secret=${tempSecret}&issuer=App`;

        res.status(201).json({
            message: 'Método TOTP registrado temporalmente. Por favor, verifica el código.',
            methodId: newMethod._id,
            qrCodeUrl: qrCodeUrl // Devolver QR/Secreto para que el usuario lo escanee
        });

    } catch (error) {
        console.error('Error al iniciar el registro de 2FA:', error);
        res.status(500).json({ message: "Error del servidor al registrar 2FA." });
    }
};

// POST /api/users/2fa/verify/totp
exports.verifyTOTP = async (req, res) => {
    const { code, methodId } = req.body;
    const userId = req.user.id;

    try {
        const method = await TwoFAMethod.findOne({ _id: methodId, userId: userId, deleted: false });

        if (!method) {
            return res.status(404).json({ message: 'Método 2FA no encontrado o acceso denegado.' });
        }

        // TODO: Lógica REAL: Verificar el código usando speakeasy.verify(secret, code)
        const isCodeValid = code === '123456'; // Placeholder de verificación

        if (!isCodeValid) {
            return res.status(400).json({ message: 'Código de verificación inválido.' });
        }

        // 1. Marcar el método actual como verificado y habilitado.
        method.isVerified = true;
        method.isEnabled = true;
        await method.save();

        // 2. Deshabilitar cualquier otro método (si se permite solo uno activo)
        await TwoFAMethod.updateMany(
            { userId: userId, _id: { $ne: methodId } },
            { isEnabled: false }
        );

        // 3. Actualizar el usuario principal
        await User.findByIdAndUpdate(userId, { twoFAEnabled: true });

        res.json({ message: 'Verificación TOTP exitosa. 2FA habilitado.' });
    } catch (error) {
        console.error('Error al verificar 2FA:', error);
        res.status(500).json({ message: "Error del servidor al verificar 2FA." });
    }
};

// GET /api/users/2fa/methods
exports.list2FAMethods = async (req, res) => {
    try {
    const { id: userId } = req.user;

        // Buscar todos los métodos no eliminados para el usuario actual, excluyendo el secreto
        const methods = await TwoFAMethod.find({ userId, deleted: false }).select('-secret');

        res.json(methods);
    } catch (error) {
        console.error('Error al listar métodos 2FA:', error);
        res.status(500).json({ message: "Error del servidor al listar métodos 2FA." });
    }
};

// PUT /api/users/2fa/methods/:methodId/set-active
exports.setActive2FAMethod = async (req, res) => {
  const { methodId } = req.params;
  const { id: userId } = req.user;

    try {
        const method = await TwoFAMethod.findOne({ _id: methodId, userId, deleted: false, isVerified: true });

        if (!method) {
            return res.status(404).json({ message: 'Método no encontrado, eliminado o no verificado.' });
        }

        // 1. Deshabilitar todos los métodos del usuario
        await TwoFAMethod.updateMany({ userId }, { isEnabled: false });

        // 2. Habilitar el método seleccionado
        const updatedMethod = await TwoFAMethod.findByIdAndUpdate(
            methodId,
            { isEnabled: true },
            { new: true }
        ).select('-secret');

        // 3. Asegurar que el usuario principal tenga twoFAEnabled: true
        await User.findByIdAndUpdate(userId, { twoFAEnabled: true });

        res.json({ message: 'Método 2FA activo cambiado con éxito.', method: updatedMethod });
    } catch (error) {
        console.error('Error al establecer método 2FA activo:', error);
        res.status(500).json({ message: "Error del servidor al establecer método 2FA activo." });
    }
};

// DELETE /api/users/2fa/methods/:methodId (Soft Delete)
exports.delete2FAMethod = async (req, res) => {
  const { methodId } = req.params;
  const { id: userId } = req.user;

    try {
        // 1. Soft Delete del método (lo marca como eliminado y deshabilitado)
        const deletedMethod = await TwoFAMethod.findOneAndUpdate(
          { _id: methodId, userId, deleted: false },
            { deleted: true, isEnabled: false },
            { new: true }
        );

        if (!deletedMethod) {
            return res.status(404).json({ message: 'Método 2FA no encontrado o ya eliminado.' });
        }

        // 2. Verificar si quedan métodos activos (no eliminados y habilitados)
        const remainingActiveMethods = await TwoFAMethod.countDocuments({
          userId,
            deleted: false,
            isEnabled: true
        });

        // 3. Si no queda ninguno, deshabilitar 2FA en el perfil del usuario.
        if (remainingActiveMethods === 0) {
            await User.findByIdAndUpdate(userId, { twoFAEnabled: false });
        }

        res.json({ message: 'Método 2FA eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar método 2FA:', error);
        res.status(500).json({ message: "Error del servidor al eliminar método 2FA." });
    }
};