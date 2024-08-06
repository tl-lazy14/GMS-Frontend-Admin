import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "@fontsource-variable/outfit";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/MainLayout";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import GymManagersPage from "./pages/GymManagersPage";
import GymManagerAdd from "./pages/GymManagerAdd";
import GymManagerEdit from "./pages/GymManagerEdit";
import NonMemCustomersPage from "./pages/NonMemCustomersPage";
import { Box } from "@mui/material";
import RegistrationsPage from "./pages/RegistrationsPage";
import MembersPage from "./pages/MembersPage";
import CreateMemberPage from "./pages/CreateMemberPage";
import DetailMemberPage from "./pages/DetailMemberPage";
import BrandInfoPage from "./pages/BrandInfoPage";
import EditBrandInfoPage from "./pages/EditBrandInfoPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import CreateExercisePage from "./pages/CreateExercisePage";
import EditExercisePage from "./pages/EditExercisePage";
import ResultsPage from "./pages/ResultsPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";
import EditResultPage from "./pages/EditResultPage";
import GymsPage from "./pages/GymsPage";
import CreateGymPage from "./pages/CreateGymPage";
import EditGymPage from "./pages/EditGymPage";
import EquipmentInfoPage from "./pages/EquipmentInfoPage";
import FaultyEquipmentPage from "./pages/FaultyEquipmentPage";
import CoachesPage from "./pages/CoachesPage";
import CoachDetailPage from "./pages/CoachDetailPage";
import CreateCoachPage from "./pages/CreateCoachPage";
import EditCoachPage from "./pages/EditCoachPage";
import ClassesPage from "./pages/ClassesPage";
import MembershipPage from "./pages/MembershipPage";
import PTServicePage from "./pages/PTServicePage";
import ServiceInfoPage from "./pages/ServiceInfoPage";
import WebContentPage from "./pages/WebContentPage";
import { UserProvider } from "./components/userContext";

const App = () => {
  return (
    <Box className="App">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gym-managers" element={<GymManagersPage />} />
              <Route path="/gym-managers/add" element={<GymManagerAdd />} />
              <Route
                path="/gym-managers/edit/:id"
                element={<GymManagerEdit />}
              />
              <Route path="/customers/members" element={<MembersPage />} />
              <Route
                path="/customers/members/create/:id"
                element={<CreateMemberPage />}
              />
              <Route
                path="/customers/members/details/:id"
                element={<DetailMemberPage />}
              />
              <Route
                path="/customers/non-member-customers"
                element={<NonMemCustomersPage />}
              />
              <Route
                path="/customers/registrations"
                element={<RegistrationsPage />}
              />
              <Route path="/brand-info" element={<BrandInfoPage />} />
              <Route path="/brand-info/edit" element={<EditBrandInfoPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route
                path="/articles/detail/:id"
                element={<ArticleDetailsPage />}
              />
              <Route path="/articles/create" element={<CreateArticlePage />} />
              <Route path="/articles/edit/:id" element={<EditArticlePage />} />
              <Route
                path="/exercise-library"
                element={<ExerciseLibraryPage />}
              />
              <Route
                path="/exercise-library/create"
                element={<CreateExercisePage />}
              />
              <Route
                path="/exercise-library/edit/:id"
                element={<EditExercisePage />}
              />
              <Route path="/training-results" element={<ResultsPage />} />
              <Route
                path="/training-results/detail/:id"
                element={<ResultDetailsPage />}
              />
              <Route
                path="/training-results/edit/:id"
                element={<EditResultPage />}
              />
              <Route path="/gyms" element={<GymsPage />} />
              <Route path="/gyms/create" element={<CreateGymPage />} />
              <Route path="/gyms/edit/:id" element={<EditGymPage />} />
              <Route path="/equipment/info" element={<EquipmentInfoPage />} />
              <Route
                path="/equipment/faulty-management"
                element={<FaultyEquipmentPage />}
              />
              <Route path="/coaches" element={<CoachesPage />} />
              <Route path="/coaches/add" element={<CreateCoachPage />} />
              <Route path="/coaches/detail/:id" element={<CoachDetailPage />} />
              <Route path="/coaches/edit/:id" element={<EditCoachPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/services/membership" element={<MembershipPage />} />
              <Route
                path="/services/personal-trainers"
                element={<PTServicePage />}
              />
              <Route
                path="/services/service-information"
                element={<ServiceInfoPage />}
              />
              <Route path="/website-content" element={<WebContentPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    </Box>
  );
};

export default App;
