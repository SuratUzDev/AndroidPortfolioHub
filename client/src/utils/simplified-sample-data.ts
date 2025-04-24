// No longer using Firebase for data storage
import { apiRequest } from "@/lib/queryClient";
import { App, BlogPost, GithubRepo, CodeSample, Profile } from "@shared/schema";
import { downloadAndSaveImage, downloadMultipleImages } from "./imageDownloader";

// Sample Apps
const sampleApps: Omit<App, "id">[] = [
  {
    title: "TaskMaster Pro",
    description: "A productivity app that helps users manage their tasks, set reminders, and track their progress. Features include task categories, priority levels, due dates, and detailed statistics.",
    category: "Productivity",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2387/2387635.png",
    screenshotUrls: [
      "https://cdn.dribbble.com/users/1987820/screenshots/15465938/media/554667e022fe8a3550acc29876a47b5e.png",
      "https://cdn.dribbble.com/users/1987820/screenshots/15465938/media/f2e33e98fdfe85893e79f832b19a3505.png"
    ],
    featured: true,
    playStoreUrl: "https://play.google.com/store/apps",
    githubUrl: null,
    rating: "4.8",
    downloads: "100,000+"
  },
  {
    title: "FitTrack",
    description: "A fitness tracking application that helps users monitor their workouts, nutrition, and health metrics. The app offers personalized workout plans, diet recommendations, and detailed progress charts.",
    category: "Health & Fitness",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png",
    screenshotUrls: [
      "https://cdn.dribbble.com/users/3825719/screenshots/16828034/media/9615a242e34212b1d5330f8b5767e23a.png"
    ],
    featured: false,
    playStoreUrl: "https://play.google.com/store/apps",
    githubUrl: null,
    rating: "4.6",
    downloads: "50,000+"
  },
  {
    title: "WeatherNow",
    description: "A comprehensive weather app that provides real-time forecasts, severe weather alerts, and hourly updates. Features include interactive radar maps, detailed 10-day forecasts, and customizable widgets.",
    category: "Utilities",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
    screenshotUrls: [
      "https://cdn.dribbble.com/users/1622147/screenshots/16646253/media/3f591d0813788b85c5a5a59c6a266e79.png"
    ],
    featured: false,
    playStoreUrl: "https://play.google.com/store/apps",
    githubUrl: "https://github.com/example/weathernow",
    rating: "4.7",
    downloads: "200,000+"
  }
];

// Sample GitHub Repos
const sampleGithubRepos: Omit<GithubRepo, "id">[] = [
  {
    name: "android-clean-architecture-boilerplate",
    description: "A boilerplate project implementing Clean Architecture in Android using Kotlin, Coroutines, Flow, Hilt, and Jetpack libraries.",
    stars: 842,
    forks: 195,
    url: "https://github.com/example/android-clean-architecture-boilerplate",
    tags: ["kotlin", "android", "clean-architecture", "mvvm", "jetpack"]
  },
  {
    name: "kotlin-flow-examples",
    description: "Comprehensive examples showcasing the use of Kotlin Flow for reactive programming in Android applications.",
    stars: 573,
    forks: 104,
    url: "https://github.com/example/kotlin-flow-examples",
    tags: ["kotlin", "flow", "coroutines", "reactive-programming"]
  },
  {
    name: "jetpack-compose-ui-samples",
    description: "A collection of sample UIs built with Jetpack Compose, showcasing modern Android UI development approaches.",
    stars: 1204,
    forks: 287,
    url: "https://github.com/example/jetpack-compose-ui-samples",
    tags: ["android", "jetpack-compose", "ui", "material-design", "kotlin"]
  }
];

// Sample Blog Posts
const sampleBlogPosts: Omit<BlogPost, "id">[] = [
  {
    title: "Modern Android Architecture: A Deep Dive",
    slug: "modern-android-architecture-deep-dive",
    excerpt: "Explore the evolution of Android architecture patterns and learn how to implement a robust, scalable architecture in your apps.",
    content: `# Modern Android Architecture: A Deep Dive

## Introduction

Android architecture has evolved significantly over the years. From the early days of monolithic applications to today's modular, testable, and maintainable architectures. This post explores the journey and provides practical insights for implementing modern architecture in your Android applications.

## The Evolution of Android Architecture

### Early Days: Activity-Centric Approach

In the early days of Android development, applications were typically built around Activities. Business logic, UI logic, and data access were often tightly coupled within Activity classes, leading to what we now refer to as "God Activities" - massive classes handling too many responsibilities.

### MVC, MVP, and MVVM

As applications grew more complex, developers began adopting architectural patterns from other platforms:

- **MVC (Model-View-Controller)**: Separating data, presentation, and control logic
- **MVP (Model-View-Presenter)**: Further isolating UI logic from business logic
- **MVVM (Model-View-ViewModel)**: Leveraging data binding to reduce boilerplate

### Clean Architecture

Robert C. Martin's Clean Architecture principles found their way into Android development, emphasizing the separation of concerns through distinct layers:

- **Domain Layer**: Business logic and entities
- **Data Layer**: Repositories and data sources
- **Presentation Layer**: UI components and ViewModels

## Modern Android Architecture

The recommended architecture today combines Clean Architecture principles with Android-specific considerations:

### Core Components

1. **UI Layer (Presentation)**
   - Activities/Fragments (Views)
   - ViewModels
   - UI State management

2. **Domain Layer**
   - Use Cases
   - Business Models
   - Repository Interfaces

3. **Data Layer**
   - Repository Implementations
   - Remote Data Sources (APIs)
   - Local Data Sources (Database)
   - Data Mappers

### Key Technologies

- **Jetpack Compose**: Declarative UI
- **Kotlin Coroutines & Flow**: Asynchronous programming
- **Hilt/Koin**: Dependency injection
- **Room**: Database management
- **Retrofit**: Network communication
- **DataStore**: Preferences storage

## Conclusion

Modern Android architecture is about creating applications that are:

- **Testable**: Each component can be tested in isolation
- **Maintainable**: Changes in one part don't ripple through the entire codebase
- **Scalable**: New features can be added without major refactoring
- **Modular**: Components can be reused across features

By adopting clean architecture principles and leveraging modern Android libraries, you can build applications that stand the test of time and accommodate changing requirements.`,
    coverImageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    publishedAt: new Date().toISOString(),
    author: "Sulton UzDev",
    isFeatured: true,
    tags: ["android", "architecture", "kotlin", "mvvm"]
  },
  {
    title: "Building Modern UIs with Jetpack Compose",
    slug: "building-modern-uis-with-jetpack-compose",
    excerpt: "Learn how to create beautiful, responsive UIs with Jetpack Compose, Android's modern toolkit for building native UI.",
    content: `# Building Modern UIs with Jetpack Compose

## Introduction

Jetpack Compose is Android's modern UI toolkit that simplifies and accelerates UI development. It's a declarative UI framework that allows you to build native UIs without the complexities of the traditional View system. In this article, we'll explore how to create beautiful, responsive UIs with Jetpack Compose.

## Getting Started with Compose

To use Jetpack Compose in your project, you need to add the following dependencies to your app's build.gradle file:

\`\`\`gradle
dependencies {
    implementation "androidx.compose.ui:ui:1.3.0"
    implementation "androidx.compose.material:material:1.3.0"
    implementation "androidx.compose.ui:ui-tooling-preview:1.3.0"
    debugImplementation "androidx.compose.ui:ui-tooling:1.3.0"
}
\`\`\`

## Basic Concepts

### Composable Functions

Composables are the building blocks of your UI. They are functions annotated with @Composable that can emit UI elements:

\`\`\`kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}
\`\`\`

### State Management

State in Compose is handled through state objects. When state changes, Compose automatically recomposes affected parts of the UI:

\`\`\`kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = "Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
\`\`\`

## Conclusion

Jetpack Compose represents a paradigm shift in Android UI development. Its declarative nature, powerful state management, and seamless integration with Material Design make it an excellent choice for building modern Android UIs.

As the ecosystem continues to evolve, Compose is becoming the standard for Android UI development, replacing the traditional View system and XML layouts.`,
    coverImageUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    author: "Sulton UzDev",
    isFeatured: false,
    tags: ["android", "jetpack-compose", "ui", "material-design"]
  },
  {
    title: "Effective Kotlin Coroutines for Android Developers",
    slug: "effective-kotlin-coroutines-for-android-developers",
    excerpt: "Master Kotlin Coroutines and Flow to write clean, efficient asynchronous code in your Android applications.",
    content: `# Effective Kotlin Coroutines for Android Developers

## Introduction

Asynchronous programming is a critical aspect of Android development. From network calls to database operations, handling async operations elegantly is essential for responsive apps. Kotlin Coroutines provide a modern, efficient solution to this challenge.

## What are Coroutines?

Coroutines are a Kotlin feature that allow you to write asynchronous, non-blocking code in a sequential style. They simplify async programming by avoiding callback hell and making code more readable.

## Basic Concepts

### Coroutine Builders

Coroutines are launched using builders:

\`\`\`kotlin
// Launch a coroutine in the main scope
lifecycleScope.launch {
    // Coroutine code here
}

// Launch a coroutine that returns a result
val deferred = lifecycleScope.async {
    // Compute and return a result
    "Result"
}
val result = deferred.await()
\`\`\`

### Suspension Points

The \`suspend\` keyword marks functions that can be paused and resumed later:

\`\`\`kotlin
suspend fun fetchData(): Data {
    delay(1000) // Non-blocking delay
    return networkService.getData()
}
\`\`\`

## Conclusion

Kotlin Coroutines and Flow provide a powerful framework for handling asynchronous operations in Android. By following the patterns and best practices outlined in this article, you can write cleaner, more efficient, and more maintainable code.

Key takeaways:
- Use the appropriate coroutine scope for your context
- Leverage structured concurrency for reliable code
- Use Flow for reactive streams of data
- Handle errors properly at all levels
- Write testable code by injecting dispatchers`,
    coverImageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    author: "Sulton UzDev",
    isFeatured: false,
    tags: ["kotlin", "coroutines", "android", "asynchronous"]
  }
];

// Sample Profile
const sampleProfile: Profile = {
  id: "1",
  name: "Sulton UzDev",
  title: "Android Developer & Kotlin Enthusiast",
  bio: "Experienced Android developer with 5+ years building modern, scalable mobile applications using Kotlin, Jetpack Compose, and modern architecture patterns.",
  email: "contact@sultonuzdev.com",
  phone: "+1 (123) 456-7890",
  location: "Tashkent, Uzbekistan",
  avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
  experience: [
    {
      company: "Innovative Mobile Solutions",
      position: "Senior Android Developer",
      startDate: new Date(2020, 1, 1),
      description: "Leading development of enterprise Android applications using Kotlin, Jetpack Compose, and Clean Architecture."
    },
    {
      company: "Mobile App Studio",
      position: "Android Developer",
      startDate: new Date(2018, 3, 15),
      endDate: new Date(2020, 1, 1),
      description: "Developed consumer-facing Android applications with Kotlin, MVVM architecture, and Material Design principles."
    }
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor's Degree",
      field: "Computer Science",
      graduationDate: new Date(2018, 5, 1)
    }
  ],
  skills: [
    "Kotlin", "Java", "Android SDK", "Jetpack Compose", "MVVM", 
    "Clean Architecture", "Coroutines", "Flow", "Retrofit", "Room"
  ],
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/sultonuzdev"
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/sultonuzdev"
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/sultonuzdev"
    }
  ]
};

// Sample Code Samples
const sampleCodeSamples: Omit<CodeSample, "id">[] = [
  {
    title: "Simple Kotlin Flow Example",
    language: "kotlin",
    code: `// Creating and collecting a simple Flow
fun getNumberFlow(): Flow<Int> = flow {
    for (i in 1..10) {
        delay(100) // Pretend we're doing something time-consuming
        emit(i) // Emit the next value
    }
}

// In a coroutine
viewModelScope.launch {
    getNumberFlow()
        .filter { it % 2 == 0 } // Only even numbers
        .map { it * it } // Square them
        .collect { number ->
            println("Received: $number")
        }
}`
  },
  {
    title: "Android View Extension Functions",
    language: "kotlin",
    code: `// Extension function to make a view visible
fun View.visible() {
    visibility = View.VISIBLE
}

// Extension function to hide a view (gone)
fun View.gone() {
    visibility = View.GONE
}

// Extension function to make a view invisible (keeps the space)
fun View.invisible() {
    visibility = View.INVISIBLE
}`
  },
  {
    title: "Basic Jetpack Compose UI",
    language: "kotlin",
    code: `@Composable
fun GreetingCard(name: String) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = 4.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Hello, $name!",
                style = MaterialTheme.typography.h5
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Welcome to Jetpack Compose",
                style = MaterialTheme.typography.body1
            )
        }
    }
}`
  }
];

// Function to check if a collection is empty
// Function to check if a collection is empty (using REST API instead of Firebase)
async function isCollectionEmpty(collectionName: string): Promise<boolean> {
  try {
    let endpoint = '';
    
    // Map collection names to their correct API endpoints
    switch (collectionName.toLowerCase()) {
      case 'apps':
        endpoint = '/api/apps';
        break;
      case 'githubrepos':
        endpoint = '/api/github-repos';
        break;
      case 'blogposts':
        endpoint = '/api/blog';
        break;
      case 'codesamples':
        endpoint = '/api/code-samples';
        break;
      case 'profile':
        endpoint = '/api/profile';
        break;
      default:
        endpoint = `/api/${collectionName.toLowerCase()}`;
    }
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      return true; // Assume empty if error
    }
    const data = await response.json();
    return !data || (Array.isArray(data) && data.length === 0);
  } catch (error) {
    console.error(`Error checking if ${collectionName} is empty:`, error);
    return true; // Assume empty if error
  }
}

// Function to seed the database with sample data using API calls
export async function seedDatabase() {
  try {
    // Check if collections are already populated
    const appsEmpty = await isCollectionEmpty("apps");
    const reposEmpty = await isCollectionEmpty("githubRepos");
    const postsEmpty = await isCollectionEmpty("blogPosts");
    const samplesEmpty = await isCollectionEmpty("codeSamples");
    const profileEmpty = await isCollectionEmpty("profile");
    
    // Only add sample data if the collections are empty
    if (appsEmpty) {
      for (const app of sampleApps) {
        try {
          // Download and save images locally
          const localIconUrl = await downloadAndSaveImage(app.iconUrl, 'apps');
          const localScreenshotUrls = await downloadMultipleImages(app.screenshotUrls || [], 'apps');
          
          // Create app with local image URLs
          await apiRequest('/api/apps', {
            method: 'POST',
            body: JSON.stringify({
              ...app,
              iconUrl: localIconUrl,
              screenshotUrls: localScreenshotUrls
            }),
          });
        } catch (appError) {
          console.error("Error adding app:", appError);
        }
      }
      console.log("Sample apps added to database");
    }
    
    if (reposEmpty) {
      for (const repo of sampleGithubRepos) {
        await apiRequest('/api/github-repos', {
          method: 'POST',
          body: JSON.stringify(repo),
        });
      }
      console.log("Sample GitHub repos added to database");
    }
    
    if (postsEmpty) {
      for (const post of sampleBlogPosts) {
        try {
          // Download and save cover image locally
          const localCoverImageUrl = await downloadAndSaveImage(post.coverImageUrl, 'blog');
          
          // Create blog post with local image URL
          await apiRequest('/api/blog', {
            method: 'POST',
            body: JSON.stringify({
              ...post,
              coverImageUrl: localCoverImageUrl
            }),
          });
        } catch (postError) {
          console.error("Error adding blog post:", postError);
        }
      }
      console.log("Sample blog posts added to database");
    }
    
    if (samplesEmpty) {
      for (const sample of sampleCodeSamples) {
        await apiRequest('/api/code-samples', {
          method: 'POST',
          body: JSON.stringify(sample),
        });
      }
      console.log("Sample code samples added to database");
    }
    
    if (profileEmpty) {
      try {
        // Download and save the profile avatar
        const localAvatarUrl = await downloadAndSaveImage(sampleProfile.avatarUrl, 'profile');
        
        // Create profile with local avatar URL
        await apiRequest('/api/profile', {
          method: 'POST',
          body: JSON.stringify({
            ...sampleProfile,
            avatarUrl: localAvatarUrl
          }),
        });
        console.log("Sample profile added to database");
      } catch (profileError) {
        console.error("Error adding profile:", profileError);
      }
    }
    
    return {
      success: true,
      message: "Database seeded successfully with sample data!"
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Error seeding database: " + (error instanceof Error ? error.message : String(error))
    };
  }
}