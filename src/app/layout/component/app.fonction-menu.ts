
import { MenuItem } from 'primeng/api';

export function getHomeMenu(profil: string): MenuItem[] {
  return [
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [`${profil}/`] },
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [`${profil}/compte`] },
        ]
    }
  ];
}

export function getComponentsMenu(profil: string): MenuItem[] {
    return [
        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: [`${profil}/uikit/formlayout`] },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: [`${profil}/uikit/input`] },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: [`${profil}/uikit/button`] },
                { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: [`${profil}/uikit/table`] },
                { label: 'List', icon: 'pi pi-fw pi-list', routerLink: [`${profil}/uikit/list`] },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: [`${profil}/uikit/tree`] },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: [`${profil}/uikit/panel`] },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: [`${profil}/uikit/overlay`] },
                { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: [`${profil}/uikit/media`] },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: [`${profil}/uikit/menu`] },
                { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: [`${profil}/uikit/message`] },
                { label: 'File', icon: 'pi pi-fw pi-file', routerLink: [`${profil}/uikit/file`] },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: [`${profil}/uikit/charts`] },
                { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: [`${profil}/uikit/timeline`] },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: [`${profil}/uikit/misc`] }
            ]
        }
    ];
}

export function getPagesMenu(profil: string): MenuItem[] {
    return [
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: [`${profil}/pages`],
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: [`${profil}/landing`]
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            routerLink: [`${profil}/auth/login`]
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            routerLink: [`${profil}/auth/error`]
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: [`${profil}/auth/access`]
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: [`${profil}/pages/crud`]
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: [`${profil}/pages/notfound`]
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: [`${profil}/pages/empty`]
                }
            ]
        }
    ];
}

export function getHierarchyMenu(profil: string): MenuItem[] {
    return [
        {
            label: 'Hierarchy',
            items: [
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                }
            ]
        }
    ];
}

export function getStartedMenu(profil: string): MenuItem[] {
    return [
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-book',
                    routerLink: [`${profil}/documentation`]
                },
                {
                    label: 'View Source',
                    icon: 'pi pi-fw pi-github',
                    url: 'https://github.com/primefaces/sakai-ng',
                    target: '_blank'
                }
            ]
        }
    ];
}