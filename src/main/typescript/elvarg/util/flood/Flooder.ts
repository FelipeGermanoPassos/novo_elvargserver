class Flooder implements Runnable {
    clients: Map<string, Client> = new Map<string, Client>();
    private running: boolean = false;

    start() {
        if (!this.running) {
            this.running = true;
            new Thread(this).start();
        }
    }

    stop() {
        this.running = false;
    }

    login(amount: number) {
        this.start();
        synchronized (this.clients) {
            for (let i = 0; i < amount; i++) {
                try {
                    let username = "bot" + (this.clients.size).toString();
                    let password = "bot";
                    new Client(Misc.formatText(username), password).attemptLogin();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    run() {
        while (this.running) {
            try {
                let i = this.clients.entries();
                let entry = i.next().value;
                while (entry !== undefined) {
                    try {
                        entry[1].process();
                    } catch (e) {
                        console.error(e);
                        i.delete(entry[0]);
                    }
                    entry = i.next().value;
                }
                Thread.sleep(300);
            } catch (e) {
                console.error(e);
            }
        }
    }
}


