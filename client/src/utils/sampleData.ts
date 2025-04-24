// No longer using Firebase for data storage
import { apiRequest } from "@/lib/queryClient";
import { App, BlogPost, GithubRepo, CodeSample } from "@shared/schema";

// Just for debugging purposes
console.log("Sample data module loaded");

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

## Practical Implementation

Let's look at how we might implement this architecture in a real application:

\`\`\`kotlin
// Domain Layer - Entity
data class User(
    val id: String,
    val name: String,
    val email: String
)

// Domain Layer - Repository Interface
interface UserRepository {
    suspend fun getUser(id: String): User
    suspend fun updateUser(user: User): Boolean
}

// Domain Layer - Use Case
class GetUserUseCase(private val repository: UserRepository) {
    suspend operator fun invoke(userId: String): User {
        return repository.getUser(userId)
    }
}

// Data Layer - Repository Implementation
class UserRepositoryImpl(
    private val remoteDataSource: UserRemoteDataSource,
    private val localDataSource: UserLocalDataSource
) : UserRepository {
    override suspend fun getUser(id: String): User {
        return try {
            val remoteUser = remoteDataSource.getUser(id)
            localDataSource.saveUser(remoteUser)
            remoteUser
        } catch (e: Exception) {
            localDataSource.getUser(id)
        }
    }
    
    override suspend fun updateUser(user: User): Boolean {
        return remoteDataSource.updateUser(user)
    }
}

// Presentation Layer - ViewModel
class UserViewModel(
    private val getUserUseCase: GetUserUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()
    
    fun loadUser(userId: String) {
        viewModelScope.launch {
            _uiState.value = UserUiState(isLoading = true)
            try {
                val user = getUserUseCase(userId)
                _uiState.value = UserUiState(user = user)
            } catch (e: Exception) {
                _uiState.value = UserUiState(error = e.message)
            }
        }
    }
}

// Presentation Layer - UI State
data class UserUiState(
    val user: User? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
\`\`\`

## Conclusion

Modern Android architecture is about creating applications that are:

- **Testable**: Each component can be tested in isolation
- **Maintainable**: Changes in one part don't ripple through the entire codebase
- **Scalable**: New features can be added without major refactoring
- **Modular**: Components can be reused across features

By adopting clean architecture principles and leveraging modern Android libraries, you can build applications that stand the test of time and accommodate changing requirements.

What architecture do you use in your Android applications? Share your experiences in the comments below!`,
    coverImageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    publishedAt: new Date().toISOString(),
    author: "Jane Doe",
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

### Layouts

Compose provides several layout components for arranging UI elements:

\`\`\`kotlin
@Composable
fun LayoutExample() {
    Column {
        Row {
            Text("Item 1")
            Spacer(modifier = Modifier.width(8.dp))
            Text("Item 2")
        }
        Spacer(modifier = Modifier.height(16.dp))
        Box {
            Image(painter = painterResource(id = R.drawable.background), 
                  contentDescription = null)
            Text("Overlay text", 
                 modifier = Modifier.align(Alignment.Center))
        }
    }
}
\`\`\`

## Building a Real-World UI

Let's build a more complex UI - a profile card component:

\`\`\`kotlin
@Composable
fun ProfileCard(
    name: String,
    title: String,
    imageUrl: String,
    onMessageClick: () -> Unit,
    onFollowClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = 4.dp,
        shape = RoundedCornerShape(8.dp)
    ) {
        Column {
            // Header with image and info
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Profile image
                AsyncImage(
                    model = imageUrl,
                    contentDescription = "Profile picture of $name",
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )
                
                // Name and title
                Column(
                    modifier = Modifier
                        .padding(start = 16.dp)
                        .weight(1f)
                ) {
                    Text(
                        text = name,
                        style = MaterialTheme.typography.h6
                    )
                    Text(
                        text = title,
                        style = MaterialTheme.typography.body2,
                        color = MaterialTheme.colors.onSurface.copy(alpha = 0.7f)
                    )
                }
            }
            
            Divider()
            
            // Action buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Button(
                    onClick = onMessageClick,
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = MaterialTheme.colors.primary
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Email,
                        contentDescription = "Message",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Message")
                }
                
                Button(
                    onClick = onFollowClick,
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = MaterialTheme.colors.secondary
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Follow",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Follow")
                }
            }
        }
    }
}
\`\`\`

## Animation

Compose makes animations easy to implement. Here's an example of a simple fade-in animation:

\`\`\`kotlin
@Composable
fun AnimatedVisibility(content: @Composable () -> Unit) {
    var visible by remember { mutableStateOf(false) }
    
    LaunchedEffect(key1 = Unit) {
        visible = true
    }
    
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(initialAlpha = 0f)
    ) {
        content()
    }
}
\`\`\`

## Material Design Integration

Compose has built-in support for Material Design components and themes:

\`\`\`kotlin
@Composable
fun MaterialApp() {
    MyAppTheme {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("My Compose App") },
                    actions = {
                        IconButton(onClick = { /* Handle click */ }) {
                            Icon(Icons.Default.Settings, "Settings")
                        }
                    }
                )
            },
            floatingActionButton = {
                FloatingActionButton(onClick = { /* Handle click */ }) {
                    Icon(Icons.Default.Add, "Add item")
                }
            }
        ) { paddingValues ->
            // Main content
            LazyColumn(
                contentPadding = paddingValues,
                modifier = Modifier.fillMaxSize()
            ) {
                // List items
                items(20) { index ->
                    ListItem(
                        text = { Text("Item $index") },
                        icon = {
                            Icon(Icons.Default.Star, contentDescription = null)
                        }
                    )
                    Divider()
                }
            }
        }
    }
}
\`\`\`

## Responsive UIs

Making your UI responsive with Compose is straightforward using conditional layouts:

\`\`\`kotlin
@Composable
fun ResponsiveLayout(windowSizeClass: WindowSizeClass) {
    when (windowSizeClass) {
        WindowSizeClass.COMPACT -> {
            // Phone layout
            Column {
                // Content for smaller screens
            }
        }
        WindowSizeClass.MEDIUM -> {
            // Tablet layout
            Row {
                // Two-pane layout
            }
        }
        WindowSizeClass.EXPANDED -> {
            // Desktop/foldable layout
            Row {
                // Multi-pane layout
            }
        }
    }
}
\`\`\`

## Testing Compose UIs

Compose comes with built-in testing support:

\`\`\`kotlin
@Test
fun counterIncrements() {
    composeTestRule.setContent {
        Counter()
    }
    
    // Find the button and click it
    composeTestRule.onNodeWithText("Increment").performClick()
    
    // Verify the count has increased
    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
\`\`\`

## Conclusion

Jetpack Compose represents a paradigm shift in Android UI development. Its declarative nature, powerful state management, and seamless integration with Material Design make it an excellent choice for building modern Android UIs.

As the ecosystem continues to evolve, Compose is becoming the standard for Android UI development, replacing the traditional View system and XML layouts.

Have you migrated your app to Jetpack Compose? Share your experiences in the comments below!`,
    coverImageUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    author: "John Smith",
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

### Coroutine Context and Dispatchers

Dispatchers determine what thread the coroutine runs on:

\`\`\`kotlin
lifecycleScope.launch(Dispatchers.IO) {
    // IO operations (network, database)
    val data = fetchData()
    
    withContext(Dispatchers.Main) {
        // UI operations
        updateUI(data)
    }
}
\`\`\`

## Structured Concurrency

Coroutines follow structured concurrency principles, ensuring that no coroutines are lost and all are properly cleaned up:

\`\`\`kotlin
lifecycleScope.launch {
    val result1 = async { api.getUser() }
    val result2 = async { database.getPreferences() }
    
    updateUI(result1.await(), result2.await())
}
// Both coroutines are guaranteed to complete or be cancelled
// when the parent coroutine completes
\`\`\`

## Error Handling

Coroutines provide several mechanisms for handling errors:

\`\`\`kotlin
lifecycleScope.launch {
    try {
        val data = fetchData()
        processData(data)
    } catch (e: Exception) {
        handleError(e)
    } finally {
        cleanup()
    }
}
\`\`\`

For more complex scenarios, use supervisorScope:

\`\`\`kotlin
supervisorScope {
    val task1 = async { riskyOperation1() }
    val task2 = async { riskyOperation2() }
    
    try {
        val result1 = task1.await()
        processResult1(result1)
    } catch (e: Exception) {
        handleTask1Error(e)
    }
    
    try {
        val result2 = task2.await()
        processResult2(result2)
    } catch (e: Exception) {
        handleTask2Error(e)
    }
}
\`\`\`

## Kotlin Flow

Flow is a cold asynchronous data stream built on top of coroutines:

\`\`\`kotlin
// Creating a flow
fun getStockUpdates(): Flow<StockUpdate> = flow {
    while (true) {
        val update = api.fetchLatestStockPrice()
        emit(update)
        delay(5000) // Update every 5 seconds
    }
}

// Collecting a flow
lifecycleScope.launch {
    getStockUpdates()
        .filter(item => item.changePercent > 5)
        .map(item => {
            return {
                ...item,
                description: `↑ ${item.changePercent}% from yesterday`
            };
        })
        .catch(e => handleError(e))
        .collect(item => {
            updateStockUI(item);
        })
}
\`\`\`

### StateFlow and SharedFlow

For UI state management, Android developers commonly use StateFlow and SharedFlow:

\`\`\`kotlin
class StockViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(StockUiState())
    val uiState: StateFlow<StockUiState> = _uiState.asStateFlow()
    
    private val _events = MutableSharedFlow<StockEvent>()
    val events: SharedFlow<StockEvent> = _events.asSharedFlow()
    
    init {
        viewModelScope.launch {
            getStockUpdates()
                .catch { e -> 
                    _events.emit(StockEvent.Error(e.message ?: "Unknown error"))
                }
                .collect { update ->
                    _uiState.value = _uiState.value.copy(
                        currentPrice = update.price,
                        priceChangePercent = update.changePercent
                    )
                }
        }
    }
}
\`\`\`

## Best Practices for Android

### Use the right coroutine scope

- **viewModelScope**: For ViewModel coroutines
- **lifecycleScope**: For UI coroutines that should respect the lifecycle
- **GlobalScope**: Rarely - only for truly application-level coroutines

\`\`\`kotlin
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            val result = repository.fetchData()
            // Process result
        }
    }
    // ViewModel coroutines are automatically cancelled when ViewModel is cleared
}
\`\`\`

### Cancel unnecessary work

\`\`\`kotlin
class MyRepository {
    private val coroutineScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var currentJob: Job? = null
    
    fun startProcess() {
        // Cancel any ongoing job before starting a new one
        currentJob?.cancel()
        currentJob = coroutineScope.launch {
            // Long-running task
        }
    }
    
    fun cleanup() {
        coroutineScope.cancel()
    }
}
\`\`\`

### Inject dispatchers for testability

\`\`\`kotlin
class UserRepository(
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    suspend fun getUser(id: String): User = withContext(ioDispatcher) {
        // Fetch user from network or database
    }
}

// In tests
val testRepository = UserRepository(TestCoroutineDispatcher())
\`\`\`

## Testing Coroutines

The \`kotlinx-coroutines-test\` library provides tools for testing coroutines:

\`\`\`kotlin
@Test
fun testUserRepository() = runTest {
    val mockApi = MockApi()
    val repository = UserRepository(mockApi, testDispatcher)
    
    val user = repository.getUser("123")
    
    assertEquals("John Doe", user.name)
}
\`\`\`

For testing ViewModels:

\`\`\`kotlin
@Test
fun testViewModel() = runTest {
    val mockRepository = MockRepository()
    val viewModel = MyViewModel(mockRepository, testDispatcher)
    
    viewModel.loadData()
    
    assertEquals(UiState.Success("Data"), viewModel.uiState.value)
}
\`\`\`

## Real-world Example: Network-Database Sync

Let's put it all together in a real-world example of fetching data from a network, saving it to a database, and displaying it in the UI:

\`\`\`kotlin
class ProductRepository(
    private val api: ProductApi,
    private val dao: ProductDao,
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    // Expose products as Flow
    val products: Flow<List<Product>> = dao.getAllProducts()
    
    suspend fun refreshProducts() {
        withContext(ioDispatcher) {
            try {
                val networkProducts = api.getProducts()
                dao.insertAll(networkProducts)
            } catch (e: Exception) {
                // Handle exceptions
                throw ProductRefreshError("Failed to refresh products", e)
            }
        }
    }
}

class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<ProductUiState>(ProductUiState.Loading)
    val uiState: StateFlow<ProductUiState> = _uiState
    
    init {
        viewModelScope.launch {
            // Collect the flow from the repository and map to UI state
            repository.products
                .map { products -> 
                    if (products.isEmpty()) {
                        ProductUiState.Empty
                    } else {
                        ProductUiState.Success(products)
                    }
                }
                .catch { e -> 
                    _uiState.value = ProductUiState.Error("Failed to load products")
                }
                .collect { state ->
                    _uiState.value = state
                }
        }
    }
    
    fun refreshProducts() {
        viewModelScope.launch {
            _uiState.value = ProductUiState.Loading
            try {
                repository.refreshProducts()
                // Don't need to update UI state here as the Flow will emit new data
            } catch (e: Exception) {
                _uiState.value = ProductUiState.Error("Failed to refresh products")
            }
        }
    }
}

@Composable
fun ProductScreen(viewModel: ProductViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    
    when (val state = uiState) {
        is ProductUiState.Loading -> LoadingIndicator()
        is ProductUiState.Empty -> EmptyState(onRefresh = { viewModel.refreshProducts() })
        is ProductUiState.Success -> ProductList(products = state.products)
        is ProductUiState.Error -> ErrorState(
            message = state.message, 
            onRetry = { viewModel.refreshProducts() }
        )
    }
}
\`\`\`

## Conclusion

Kotlin Coroutines and Flow provide a powerful framework for handling asynchronous operations in Android. By following the patterns and best practices outlined in this article, you can write cleaner, more efficient, and more maintainable code.

Key takeaways:
- Use the appropriate coroutine scope for your context
- Leverage structured concurrency for reliable code
- Use Flow for reactive streams of data
- Handle errors properly at all levels
- Write testable code by injecting dispatchers

What challenges have you faced with coroutines in your Android projects? Share your experiences in the comments!`,
    coverImageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    author: "Alex Johnson",
    isFeatured: false,
    tags: ["kotlin", "coroutines", "android", "asynchronous"]
  }
];

// Sample Code Samples
const sampleCodeSamples: Omit<CodeSample, "id">[] = [
  {
    title: "Kotlin Flow Example",
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
}

// Output:
// Received: 4
// Received: 16
// Received: 36
// Received: 64
// Received: 100`
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
}

// Extension function to show a toast from any context
fun Context.toast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

// Extension function to show a snackbar from a view
fun View.snackbar(message: String, duration: Int = Snackbar.LENGTH_SHORT) {
    Snackbar.make(this, message, duration).show()
}

// Extension function to show a snackbar with an action
fun View.snackbar(
    message: String,
    actionText: String,
    action: (View) -> Unit,
    duration: Int = Snackbar.LENGTH_INDEFINITE
) {
    Snackbar.make(this, message, duration)
        .setAction(actionText, action)
        .show()
}

// Example usage:
binding.progressBar.visible()
binding.emptyStateView.gone()

context.toast("Item saved!")

binding.root.snackbar("Network error", "Retry") { 
    viewModel.retry() 
}`
  },
  {
    title: "Jetpack Compose LazyColumn with Pull to Refresh",
    language: "kotlin",
    code: `@Composable
fun ProductList(
    products: List<Product>,
    isRefreshing: Boolean,
    onRefresh: () -> Unit
) {
    val pullRefreshState = rememberPullRefreshState(
        refreshing = isRefreshing,
        onRefresh = onRefresh
    )
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .pullRefresh(pullRefreshState)
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(products) { product ->
                ProductCard(product = product)
            }
        }
        
        PullRefreshIndicator(
            refreshing = isRefreshing,
            state = pullRefreshState,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
fun ProductCard(product: Product) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Product image
            AsyncImage(
                model = product.imageUrl,
                contentDescription = product.name,
                modifier = Modifier
                    .size(60.dp)
                    .clip(RoundedCornerShape(4.dp)),
                contentScale = ContentScale.Crop
            )
            
            // Product details
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(start = 16.dp)
            ) {
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.h6,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                
                Text(
                    text = product.description,
                    style = MaterialTheme.typography.body2,
                    color = MaterialTheme.colors.onSurface.copy(alpha = 0.7f),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                
                Text(
                    text = "$9.99",
                    style = MaterialTheme.typography.subtitle1,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colors.primary
                )
            }
        }
    }
}`
  }
];

// Function to check if a collection is empty (using REST API instead of Firebase)
async function isCollectionEmpty(collectionName: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/${collectionName.toLowerCase()}`);
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
    
    // Only add sample data if the collections are empty
    if (appsEmpty) {
      for (const app of sampleApps) {
        await apiRequest('/api/apps', {
          method: 'POST',
          body: JSON.stringify(app),
        });
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
        await apiRequest('/api/blog-posts', {
          method: 'POST',
          body: JSON.stringify(post),
        });
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