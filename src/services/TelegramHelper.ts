export class TelegramHelper {

    public content: string;

    constructor() {
        this.content = '';
    }

    public getContent(): string {
        return this.content;
    }

    public setTitle(title: string): TelegramHelper {
        this.content += `<b>${title}</b>`;
        return this;
    }

    public setAuthor(author: string): TelegramHelper {
        this.content += `<b>NODE: ${author}</b>`;
        return this;
    }

    public setDescription(description: string): TelegramHelper {
        this.content += `<pre>${description}</pre>`;
        return this;
    }

    public setField(name: string, desc: string): TelegramHelper {
        this.content += `<b>${name}</b> : <pre>${desc}</pre>`;
        return this;
    }

    public setMentioneds(mentioneds: string[]): TelegramHelper {
        mentioneds.forEach((mentioned) => {
            this.content += `@${mentioned} `
        })
        this.content += '\n';
        return this;
    }

    public resetContent(): TelegramHelper {
        this.content = '';
        return this;
    }
}