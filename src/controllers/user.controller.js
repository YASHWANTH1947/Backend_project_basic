import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Extract Data
    const { fullName, email, username, password } = req.body;

    // 2. Validation: Check for empty fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields (fullName, email, username, password) are required");
    }

    // 3. Database Check: See if user already exists (CRITICAL: added await)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // 4. File Path Extraction (Safe handling for Multer .fields())
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is mandatory");
    }

    // 5. Cloudinary Uploads
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar to Cloudinary");
    }

    // 6. Create User Object in MongoDB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // Optional field
        email,
        password, // Ensure your userSchema has a .pre("save") hook to hash this!
        username: username.toLowerCase()
    });

    // 7. Verify Creation and Remove Sensitive Fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Internal Server Error: User registration failed");
    }

    // 8. Final Response
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };