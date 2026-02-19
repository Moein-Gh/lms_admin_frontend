import type { SVGProps } from "react";

export type AppIcon = React.ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export {
  // ── Structural: directional arrows ────────────────────────────────────────
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpRight,
  ArrowDownLeft,

  // ── Structural: chevrons ──────────────────────────────────────────────────
  ChevronDown,
  ChevronDownIcon,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  ChevronUp,
  ChevronUpIcon,

  // ── Structural: actions / state ───────────────────────────────────────────
  Check,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  PlusCircle,
  X,
  XIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Settings2,
  Settings,
  MoreVertical,
  MoreVerticalIcon,

  // ── Structural: drag ──────────────────────────────────────────────────────
  GripVertical,
  GripVerticalIcon,

  // ── Structural: feedback / status ─────────────────────────────────────────
  AlertCircle,
  AlertTriangle,
  CircleIcon,
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,

  // ── Charts
  // ───────────────────────────────────────────
  ShoppingBasket,
  TramFront,
  Ellipsis,

  // ── Structural: theme / display ───────────────────────────────────────────
  Sun,
  Moon,
  Bell,
  Trash as DeleteIcon,
  Home as HomeIcon,
  Building2,
  Hash,
  Landmark,
  ReceiptText,
  CircleDollarSign,
  CheckCircle2,
  BarChart,
  FileText,
  ExternalLink,
  Clock,
  LayoutDashboard,
  CalendarCheckIcon,
  CalendarDays,
  Command,
  ImageIcon,
  Download,
  WalletIcon,
  LayoutGridIcon,
  PanelRightIcon,
  Pencil as EditIcon,
  Split,
  OctagonX as RejectIcon,
  Mail,
  Phone,
  MapPin,
  UserRoundIcon,
  Activity,
  ShieldCheck,
  Tag,
  BanknoteArrowDown,
  CheckCircle,
  CalendarClock,
  Percent,
  TrendingUp,
  RefreshCw,
  Receipt,
  EllipsisVertical,
  ChartBar,
  Gauge,
  ShoppingBag,
  GraduationCap,
  Forklift,
  Search,
  Eye,
  FilterIcon,
  Plus,
  Layers,
  CircleCheck,
  CircleDashed,
  Loader,
  Inbox,
  MessageSquare,
  Database,
  Lock,
  BadgeCheck,
  BadgeX,
  Coins,
  Folder,
  Forward,
  // ── Semantic: finance ─────────────────────────────────────────────────────
  ArrowLeftRight as TransactionIcon,
  CreditCard as CardIcon,
  HandCoins as LoanIcon,
  Receipt as InstallmentIcon,
  CalendarClock as PaymentIcon,
  CalendarCheckIcon as InstallmentDoneIcon,
  TrendingUp as TrendingUpIcon,
  Percent as PercentIcon,
  Landmark as BankIcon,
  CreditCard as LoanDisbursementIcon,
  Banknote as BanknoteIcon,

  // ── Semantic: accounts & identity ─────────────────────────────────────────
  IdCard as AccountIcon,
  UserCircle as UserCircleIcon,
  User as UserIcon,
  Shield as AdminIcon,
  Users as UsersIcon,

  // ── Semantic: contact ─────────────────────────────────────────────────────
  Mail as EmailIcon,
  Phone as PhoneIcon,
  MapPin as LocationIcon,

  // ── Semantic: navigation / pages ──────────────────────────────────────────
  Calendar as CalendarIcon,
  FileText as DocumentIcon,

  // ── Semantic: auth ────────────────────────────────────────────────────────
  LogOut as LogoutIcon
} from "lucide-react";

export { TomanIcon } from "./custom/toman-icon";
