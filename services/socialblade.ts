import SocialBlade from "socialblade";

export class SocialBladeService {
  public getInstagram = async (username: string) => {
    console.log(`Request to @${username}`);

    const client = new SocialBlade(
      process.env.SOCIALBLADE_CLIENT_ID as string,
      process.env.SOCIALBLADE_ACCESS_TOKEN as string
    );
    const data = await client.instagram.user(username);
    console.log(data);
    return data;
  };
}
