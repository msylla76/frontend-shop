import { MenuItem } from 'primeng/api';

export function getparametreMenu(profil: string): MenuItem[] {
  return [
    {
      label: 'parametre',
      items: [
          { label: 'Compter', icon: 'pi pi-fw pi-home', routerLink: [`${profil}/compter`] },
    { label: 'Compte', icon: 'pi pi-fw pi-home', routerLink: [`${profil}/compte`] },
    { label: 'Mode', icon: 'pi pi-fw pi-home', routerLink: [`${profil}/mode`] },
    
      ]
    }
  ];
}
