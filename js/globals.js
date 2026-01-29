// Exportar funções para window para compatibilidade com scripts inline no HTML
// Este arquivo mantém compatibilidade enquanto migramos para módulos ES6

import * as auth from './auth.js';
import * as router from './router.js';
import * as properties from './properties.js';
import * as products from './products.js';
import * as stock from './stock.js';
import * as plots from './plots.js';
import * as applications from './applications.js';
import * as equipment from './equipment.js';
import * as soilAnalysis from './soil_analysis.js';
import * as cropCycles from './crop_cycles.js';
import * as maps from './maps.js';
import { showNotification } from './ui.js';

// Exportar funções de autenticação para window
window.signIn = auth.signIn;
window.signUp = auth.signUp;
window.signOut = auth.signOut;
window.getCurrentUser = auth.getCurrentUser;
window.getCurrentSession = auth.getCurrentSession;
window.isAuthenticated = auth.isAuthenticated;
window.requireAuth = auth.requireAuth;

// Exportar função de navegação
window.navigate = router.navigate;

// Exportar função de notificação
window.showNotification = showNotification;

// Exportar funções de propriedades
window.getProperties = properties.getProperties;
window.getPropertyById = properties.getPropertyById;
window.createProperty = properties.createProperty;
window.updateProperty = properties.updateProperty;
window.deleteProperty = properties.deleteProperty;

// Exportar funções de produtos
window.getProducts = products.getProducts;
window.getProductById = products.getProductById;
window.createProduct = products.createProduct;
window.updateProduct = products.updateProduct;
window.deleteProduct = products.deleteProduct;

// Exportar funções de estoque
window.getStock = stock.getStock;
window.getStockById = stock.getStockById;
window.createStock = stock.createStock;
window.updateStock = stock.updateStock;
window.deleteStock = stock.deleteStock;
window.getLowStock = stock.getLowStock;

// Exportar funções de talhões
window.getPlots = plots.getPlots;
window.getPlotById = plots.getPlotById;
window.createPlot = plots.createPlot;
window.updatePlot = plots.updatePlot;
window.deletePlot = plots.deletePlot;

// Exportar funções de aplicações
window.getApplications = applications.getApplications;
window.getApplicationById = applications.getApplicationById;
window.createApplication = applications.createApplication;
window.updateApplication = applications.updateApplication;
window.deleteApplication = applications.deleteApplication;

// Exportar funções de equipamentos
window.getEquipment = equipment.getEquipment;
window.getEquipmentById = equipment.getEquipmentById;
window.createEquipment = equipment.createEquipment;
window.updateEquipment = equipment.updateEquipment;
window.deleteEquipment = equipment.deleteEquipment;

// Exportar funções de análises de solo
window.getSoilAnalyses = soilAnalysis.getSoilAnalyses;
window.getSoilAnalysisById = soilAnalysis.getSoilAnalysisById;
window.createSoilAnalysis = soilAnalysis.createSoilAnalysis;
window.updateSoilAnalysis = soilAnalysis.updateSoilAnalysis;
window.deleteSoilAnalysis = soilAnalysis.deleteSoilAnalysis;

// Exportar funções de ciclos de cultivo
window.getCropCycles = cropCycles.getCropCycles;
window.getCropCycleById = cropCycles.getCropCycleById;
window.getCrops = cropCycles.getCrops;
window.getCultureVarieties = cropCycles.getCultureVarieties;
window.createCropCycle = cropCycles.createCropCycle;
window.updateCropCycle = cropCycles.updateCropCycle;
window.deleteCropCycle = cropCycles.deleteCropCycle;

// Exportar funções de mapas
window.initMap = maps.initMap;
window.initPropertyMap = maps.initPropertyMap;
window.initPlotMap = maps.initPlotMap;
window.getPropertyCoordinates = maps.getPropertyCoordinates;
window.getPlotCoordinates = maps.getPlotCoordinates;
window.parseCoordinates = maps.parseCoordinates;
window.clearPropertyMap = maps.clearPropertyMap;
window.clearPlotMap = maps.clearPlotMap;
window.loadPlotPolygon = maps.loadPlotPolygon;
window.calculatePolygonArea = maps.calculatePolygonArea;
