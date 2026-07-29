import { Skill } from "../model/skill.model.js";

import { USER_ROLES } from "../constants/roles.js";

import { ApiError } from "../utils/ApiError.js";

export async function createSkill(userId, input) {
  return Skill.create({
    ...input,
    owner: userId,
  });
}

export async function getSkills({
  search,
  category,
  level,
  mode,
  page = 1,
  limit = 20,
}) {
  const filter = {
    status: "active",
  };

  if (category) {
    filter.category = category;
  }

  if (level) {
    filter.level = level;
  }

  if (mode) {
    filter.mode = mode;
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [skills, total] = await Promise.all([
    Skill.find(filter)
      .populate("owner", "name role")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(Number(limit)),

    Skill.countDocuments(filter),
  ]);

  return {
    skills,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function getSkillById(skillId) {
  const skill = await Skill.findOne({
    _id: skillId,
    status: {
      $ne: "removed",
    },
  }).populate("owner", "name role");

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  return skill;
}

export async function updateSkill(skillId, authenticatedUser, input) {
  const filter = {
    _id: skillId,
    status: {
      $ne: "removed",
    },
  };

  if (authenticatedUser.role !== USER_ROLES.ADMIN) {
    filter.owner = authenticatedUser.id;
  }

  const skill = await Skill.findOneAndUpdate(
    filter,
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!skill) {
    throw new ApiError(404, "Skill not found or access denied");
  }

  return skill;
}

export async function deleteSkill(skillId, authenticatedUser) {
  const filter = {
    _id: skillId,
    status: {
      $ne: "removed",
    },
  };

  if (authenticatedUser.role !== USER_ROLES.ADMIN) {
    filter.owner = authenticatedUser.id;
  }

  const skill = await Skill.findOneAndUpdate(
    filter,
    {
      $set: {
        status: "removed",
      },
    },
    {
      new: true,
    },
  );

  if (!skill) {
    throw new ApiError(404, "Skill not found or access denied");
  }

  return skill;
}
