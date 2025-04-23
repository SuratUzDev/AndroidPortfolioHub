import { db } from "./db";
import {
  apps, githubRepos, blogPosts, codeSamples, profiles
} from "@shared/schema";

/**
 * This module creates sample data in the PostgreSQL database
 * when Firebase migration is not available.
 */

// Create sample apps
export async function createSampleApps() {
  console.log("Creating sample apps...");
  try {
    // Insert app data
    await db.insert(apps).values([
      {
        title: "TaskMaster Pro",
        description: "A productivity app for task management with customizable categories, priorities, and deadlines.",
        category: "Productivity",
        iconUrl: "https://example.com/taskmaster-icon.png",
        screenshotUrls: [
          "https://example.com/taskmaster-screen1.png",
          "https://example.com/taskmaster-screen2.png"
        ],
        featured: true,
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.sultonuzdev.taskmaster",
        githubUrl: null,
        rating: "4.8",
        downloads: "50,000+"
      },
      {
        title: "WeatherNow",
        description: "Real-time weather forecasts with customizable alerts and beautiful visualizations.",
        category: "Weather",
        iconUrl: "https://example.com/weathernow-icon.png",
        screenshotUrls: [
          "https://example.com/weathernow-screen1.png",
          "https://example.com/weathernow-screen2.png"
        ],
        featured: false,
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.sultonuzdev.weathernow",
        githubUrl: "https://github.com/sultonuzdev/weathernow",
        rating: "4.6",
        downloads: "100,000+"
      }
    ]);
    console.log("Sample apps created successfully");
  } catch (error) {
    console.error("Error creating sample apps:", error);
  }
}

// Create sample GitHub repositories
export async function createSampleGithubRepos() {
  console.log("Creating sample GitHub repositories...");
  try {
    // Insert GitHub repository data
    await db.insert(githubRepos).values([
      {
        name: "android-clean-architecture-boilerplate",
        description: "A boilerplate project demonstrating clean architecture principles in Android development",
        stars: 256,
        forks: 78,
        url: "https://github.com/sultonuzdev/android-clean-architecture-boilerplate",
        tags: ["android", "clean-architecture", "mvvm", "kotlin"]
      },
      {
        name: "kotlin-coroutines-examples",
        description: "Practical examples of Kotlin coroutines for Android development",
        stars: 128,
        forks: 42,
        url: "https://github.com/sultonuzdev/kotlin-coroutines-examples",
        tags: ["kotlin", "coroutines", "android", "async"]
      }
    ]);
    console.log("Sample GitHub repositories created successfully");
  } catch (error) {
    console.error("Error creating sample GitHub repositories:", error);
  }
}

// Create sample blog posts
export async function createSampleBlogPosts() {
  console.log("Creating sample blog posts...");
  try {
    // Insert blog post data
    await db.insert(blogPosts).values([
      {
        title: "Building Modern UIs with Jetpack Compose",
        slug: "building-modern-uis-with-jetpack-compose",
        excerpt: "Learn how to build beautiful and responsive user interfaces using Jetpack Compose, Android's modern toolkit for building native UI.",
        content: "# Building Modern UIs with Jetpack Compose\n\nJetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android with less code, powerful tools, and intuitive Kotlin APIs.\n\n## Getting Started\n\nTo start using Jetpack Compose in your project, you need to add the following dependencies to your build.gradle file:\n\n```kotlin\nimplementation \"androidx.compose.ui:ui:1.0.0\"\nimplementation \"androidx.compose.material:material:1.0.0\"\nimplementation \"androidx.compose.ui:ui-tooling:1.0.0\"\n```\n\n## Creating Your First Composable\n\n```kotlin\n@Composable\nfun Greeting(name: String) {\n    Text(text = \"Hello $name!\")\n}\n```\n\nThis simple function creates a composable that displays a text greeting. You can use this composable in your app like this:\n\n```kotlin\nsetContent {\n    MyAppTheme {\n        Surface(color = MaterialTheme.colors.background) {\n            Greeting(\"Android Developer\")\n        }\n    }\n}\n```\n\n## Conclusion\n\nJetpack Compose makes Android UI development faster and easier. By using declarative programming principles, it helps you build UIs with less code and easier maintenance.",
        coverImageUrl: "https://example.com/jetpack-compose-cover.jpg",
        publishedAt: new Date().toISOString(),
        author: "Sulton UzDev",
        isFeatured: false,
        tags: ["android", "jetpack-compose", "ui", "kotlin"]
      },
      {
        title: "Modern Android Architecture: A Deep Dive",
        slug: "modern-android-architecture-deep-dive",
        excerpt: "Explore the components of modern Android architecture including MVVM, Clean Architecture, and how to implement them effectively.",
        content: "# Modern Android Architecture: A Deep Dive\n\nIn this post, we'll explore the components of modern Android architecture and how they work together to create maintainable, testable applications.\n\n## The MVVM Pattern\n\nModel-View-ViewModel (MVVM) is one of the architectural patterns recommended by Google for Android development. It helps separate the business logic from the UI components, making your code more maintainable and testable.\n\n### Components of MVVM\n\n1. **Model**: Represents the data and business logic of the application\n2. **View**: The UI components that display data to the user\n3. **ViewModel**: Acts as a bridge between the Model and View, handling UI-related data logic\n\n## Implementing Clean Architecture\n\nClean Architecture takes separation of concerns even further by dividing your app into layers:\n\n1. **Domain Layer**: Contains business logic and models\n2. **Data Layer**: Manages data sources and repositories\n3. **Presentation Layer**: Handles UI and user interaction\n\n## Code Example\n\n```kotlin\n// Domain Layer - Use Case\nclass GetUserProfileUseCase(private val userRepository: UserRepository) {\n    suspend operator fun invoke(userId: String): Result<UserProfile> {\n        return userRepository.getUserProfile(userId)\n    }\n}\n\n// Data Layer - Repository Implementation\nclass UserRepositoryImpl(private val apiService: ApiService, private val userDao: UserDao) : UserRepository {\n    override suspend fun getUserProfile(userId: String): Result<UserProfile> {\n        return try {\n            val localProfile = userDao.getUserProfile(userId)\n            if (localProfile != null && !localProfile.isStale()) {\n                Result.success(localProfile)\n            } else {\n                val remoteProfile = apiService.getUserProfile(userId)\n                userDao.saveUserProfile(remoteProfile)\n                Result.success(remoteProfile)\n            }\n        } catch (e: Exception) {\n            Result.failure(e)\n        }\n    }\n}\n\n// Presentation Layer - ViewModel\nclass UserProfileViewModel(private val getUserProfileUseCase: GetUserProfileUseCase) : ViewModel() {\n    private val _userProfile = MutableStateFlow<UiState<UserProfile>>(UiState.Loading)\n    val userProfile: StateFlow<UiState<UserProfile>> = _userProfile.asStateFlow()\n    \n    fun loadUserProfile(userId: String) {\n        viewModelScope.launch {\n            _userProfile.value = UiState.Loading\n            getUserProfileUseCase(userId)\n                .onSuccess { profile ->\n                    _userProfile.value = UiState.Success(profile)\n                }\n                .onFailure { error ->\n                    _userProfile.value = UiState.Error(error.message ?: \"Unknown error\")\n                }\n        }\n    }\n}\n```\n\n## Conclusion\n\nBy implementing MVVM and Clean Architecture principles, you create Android applications that are:\n\n- Easier to test\n- More maintainable over time\n- Better organized and scalable\n- Less prone to bugs when making changes\n\nThis architectural approach requires more initial setup, but the benefits become clear as your application grows in size and complexity.",
        coverImageUrl: "https://example.com/android-architecture-cover.jpg",
        publishedAt: new Date().toISOString(),
        author: "Sulton UzDev",
        isFeatured: true,
        tags: ["android", "architecture", "mvvm", "clean-architecture"]
      }
    ]);
    console.log("Sample blog posts created successfully");
  } catch (error) {
    console.error("Error creating sample blog posts:", error);
  }
}

// Create sample code samples
export async function createSampleCodeSamples() {
  console.log("Creating sample code samples...");
  try {
    // Insert code samples data
    await db.insert(codeSamples).values([
      {
        title: "Kotlin Flow Example",
        language: "kotlin",
        code: "import kotlinx.coroutines.flow.*\nimport kotlinx.coroutines.*\n\nsuspend fun main() {\n    // Create a flow of numbers 1..5\n    val numbersFlow = flow {\n        for (i in 1..5) {\n            println(\"Emitting $i\")\n            emit(i)\n            delay(100) // Pretend we're doing something useful\n        }\n    }\n    \n    // Collect the flow\n    coroutineScope {\n        launch {\n            numbersFlow\n                .filter { it % 2 == 0 } // Only even numbers\n                .map { it * it } // Square them\n                .collect { value ->\n                    println(\"Collected squared even number: $value\")\n                }\n        }\n    }\n}"
      },
      {
        title: "Android Compose Theme Setup",
        language: "kotlin",
        code: "import androidx.compose.foundation.isSystemInDarkTheme\nimport androidx.compose.material.MaterialTheme\nimport androidx.compose.material.darkColors\nimport androidx.compose.material.lightColors\nimport androidx.compose.runtime.Composable\nimport androidx.compose.ui.graphics.Color\n\n// Define colors\nval Purple200 = Color(0xFFBB86FC)\nval Purple500 = Color(0xFF6200EE)\nval Purple700 = Color(0xFF3700B3)\nval Teal200 = Color(0xFF03DAC5)\n\n// Define dark palette\nprivate val DarkColorPalette = darkColors(\n    primary = Purple200,\n    primaryVariant = Purple700,\n    secondary = Teal200\n)\n\n// Define light palette\nprivate val LightColorPalette = lightColors(\n    primary = Purple500,\n    primaryVariant = Purple700,\n    secondary = Teal200\n)\n\n@Composable\nfun MyAppTheme(\n    darkTheme: Boolean = isSystemInDarkTheme(),\n    content: @Composable () -> Unit\n) {\n    val colors = if (darkTheme) {\n        DarkColorPalette\n    } else {\n        LightColorPalette\n    }\n\n    MaterialTheme(\n        colors = colors,\n        typography = Typography,\n        shapes = Shapes,\n        content = content\n    )\n}"
      }
    ]);
    console.log("Sample code samples created successfully");
  } catch (error) {
    console.error("Error creating sample code samples:", error);
  }
}

// Create sample profile
export async function createSampleProfile() {
  console.log("Creating sample profile...");
  try {
    // Sample experience data
    const experience = [
      {
        company: "Android Solutions Inc.",
        position: "Senior Android Developer",
        startDate: "2020-01-01",
        endDate: null, // Current job
        description: "Leading development of enterprise Android applications using Kotlin, Jetpack Compose, and Clean Architecture."
      },
      {
        company: "Mobile Innovations Ltd.",
        position: "Android Developer",
        startDate: "2017-06-01",
        endDate: "2019-12-31",
        description: "Developed and maintained multiple Android applications with over 1 million combined downloads."
      }
    ];

    // Sample education data
    const education = [
      {
        school: "University of Technology",
        degree: "Master's",
        field: "Computer Science",
        graduationDate: "2017-05-15"
      },
      {
        school: "Tech Institute",
        degree: "Bachelor's",
        field: "Software Engineering",
        graduationDate: "2015-05-20"
      }
    ];

    // Sample social links
    const socialLinks = [
      {
        platform: "github",
        url: "https://github.com/sultonuzdev"
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/sultonuzdev"
      },
      {
        platform: "twitter",
        url: "https://twitter.com/sultonuzdev"
      }
    ];

    // Insert profile data
    await db.insert(profiles).values({
      name: "Sulton UzDev",
      title: "Android Developer & Kotlin Enthusiast",
      bio: "I'm a passionate Android developer with 5+ years of experience creating beautiful, performant mobile applications. I specialize in Kotlin, Jetpack Compose, and Clean Architecture.",
      email: "contact@sultonuzdev.com",
      phone: "+1234567890",
      location: "Uzbekistan",
      avatarUrl: "https://example.com/sulton-profile.jpg",
      experience: JSON.stringify(experience),
      education: JSON.stringify(education),
      skills: ["Kotlin", "Java", "Android", "Jetpack Compose", "MVVM", "Clean Architecture", "Coroutines", "Flow", "Room", "Retrofit"],
      socialLinks: JSON.stringify(socialLinks)
    });
    
    console.log("Sample profile created successfully");
  } catch (error) {
    console.error("Error creating sample profile:", error);
  }
}

// Run all sample data creation
export async function createSampleData() {
  console.log("Creating sample data in PostgreSQL...");
  
  try {
    await createSampleApps();
    await createSampleGithubRepos();
    await createSampleBlogPosts();
    await createSampleCodeSamples();
    await createSampleProfile();
    
    console.log("Sample data creation completed successfully!");
    return { success: true, message: "Sample data created successfully!" };
  } catch (error) {
    console.error("Sample data creation failed:", error);
    return { 
      success: false, 
      message: "Sample data creation failed", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}