import { useRouter } from 'expo-router';
import React from 'react';

export class NavigationService {
  private static router: ReturnType<typeof useRouter> | null = null;

  static initialize(router: ReturnType<typeof useRouter>) {
    this.router = router;
  }

  static navigateTo(path: string, params?: any) {
    if (!this.router) {
      console.warn('NavigationService not initialized');
      return;
    }
    
    if (params) {
      this.router.push({ pathname: path as any, params });
    } else {
      this.router.push(path as any);
    }
  }

  static goBack() {
    if (!this.router) {
      console.warn('NavigationService not initialized');
      return;
    }
    
    this.router.back();
  }

  static replace(path: string, params?: any) {
    if (!this.router) {
      console.warn('NavigationService not initialized');
      return;
    }
    
    if (params) {
      this.router.replace({ pathname: path as any, params });
    } else {
      this.router.replace(path as any);
    }
  }

  static reset() {
    if (!this.router) {
      console.warn('NavigationService not initialized');
      return;
    }
    
    this.router.replace('/(tabs)');
  }

  // Role-based navigation helpers
  static navigateToQRScanner() {
    this.navigateTo('/(tabs)/qr-scanner');
  }

  static navigateToVisitorEntry() {
    this.navigateTo('/(tabs)/visitor-entry');
  }

  static navigateToLogs() {
    this.navigateTo('/(tabs)/logs');
  }

  static navigateToVisitors() {
    this.navigateTo('/(tabs)/visitors');
  }

  static navigateToQRCode() {
    this.navigateTo('/(tabs)/qr-code');
  }

  static navigateToNotifications() {
    this.navigateTo('/(tabs)/notifications');
  }

  static navigateToResidents() {
    this.navigateTo('/(tabs)/residents');
  }

  static navigateToSettings() {
    this.navigateTo('/(tabs)/settings');
  }

  static navigateToHome() {
    this.navigateTo('/(tabs)');
  }

  // Modal navigation
  static showModal(modalName: string, params?: any) {
    this.navigateTo(`/modal/${modalName}`, params);
  }

  // QR scanner specific navigation
  static openQRScanner(mode: 'gate' | 'visitor' = 'gate') {
    this.navigateTo('/qr-scanner', { mode });
  }

  // Visitor form navigation
  static openVisitorForm(visitorData?: any) {
    this.navigateTo('/visitor-form', visitorData);
  }

  // Visitor details navigation
  static openVisitorDetails(visitorId: string) {
    this.navigateTo('/visitor-details', { visitorId });
  }
}

// Hook for using navigation service
export const useNavigationService = () => {
  const router = useRouter();
  
  React.useEffect(() => {
    NavigationService.initialize(router);
  }, [router]);

  return {
    navigate: NavigationService.navigateTo.bind(NavigationService),
    goBack: NavigationService.goBack.bind(NavigationService),
    replace: NavigationService.replace.bind(NavigationService),
    reset: NavigationService.reset.bind(NavigationService),
    navigateToQRScanner: NavigationService.navigateToQRScanner.bind(NavigationService),
    navigateToVisitorEntry: NavigationService.navigateToVisitorEntry.bind(NavigationService),
    navigateToLogs: NavigationService.navigateToLogs.bind(NavigationService),
    navigateToVisitors: NavigationService.navigateToVisitors.bind(NavigationService),
    navigateToQRCode: NavigationService.navigateToQRCode.bind(NavigationService),
    navigateToNotifications: NavigationService.navigateToNotifications.bind(NavigationService),
    navigateToResidents: NavigationService.navigateToResidents.bind(NavigationService),
    navigateToSettings: NavigationService.navigateToSettings.bind(NavigationService),
    navigateToHome: NavigationService.navigateToHome.bind(NavigationService),
    showModal: NavigationService.showModal.bind(NavigationService),
    openQRScanner: NavigationService.openQRScanner.bind(NavigationService),
    openVisitorForm: NavigationService.openVisitorForm.bind(NavigationService),
    openVisitorDetails: NavigationService.openVisitorDetails.bind(NavigationService),
  };
};
