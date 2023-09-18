import { model, Schema } from 'mongoose';

const RolePermissionSchema: Schema = new Schema(
  {
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    permissions: [{ type: Number, required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    collection: 'role_permission'
  }
);

export default model('RolePermission', RolePermissionSchema);