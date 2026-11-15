import { inject, Injectable } from '@angular/core';

import { AlertController, LoadingController } from '@ionic/angular';

@Injectable()
export class AlertService {
    private alerter = inject(AlertController);
    private loadcer = inject(LoadingController);

    async mostrarAlerta(message: string, cssClass: string) {
        let al = await this.alerter.create({
            message,
            cssClass,
        });

        await al.present();
    }

    async mostrarCargando(
        message: string, 
        durationMs: number, 
    ) {
        let loadwidget = await this.loadcer.create({ message, duration: durationMs });
        await loadwidget.present();
        return loadwidget;
    }
}
