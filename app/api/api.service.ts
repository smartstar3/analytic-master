import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Form, DBAnswers, formFromJSON, Design } from '../question';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { Company } from './company';
import { Condition, Primitive } from '../logic/logic';
import { Usage } from '../dashboard/billing/billing.component';
import { Image } from '../builder2/image-stuff/image.service';
import { Buffer } from 'buffer';
import { ConstructionSave } from '../builder2/services/init.service';
import { SubscriptionInfo } from '../payment/success/success.component';
import { PaymentFormValue } from '../payment/paymentInfo';
import { Address } from '../form/address-question/address-question.component';
import { ShareInfo, ShareResponse, SharedEmailStatistics } from '../resources/interfaces/share-info.interface';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly API_ADDR: string = environment.api_base;

  constructor(private http: HttpClient, public auth: AuthService) {}
  // manage reset password
  resetPassword(newPassword: string, email: string, hash: string): Observable<void> {
    return this.putRequest<void>({ newPassword, hash, email }, ['users', 'reset-password']);
  }

  sendResetPasswordEmail(email: string): Observable<void> {
    return this.postRequest<void>({ email }, ['users', 'reset-password-email']);
  }

  // manage subscriptions
  getSubscription(): Observable<SubscriptionInfo[]> {
    return this.getRequest<SubscriptionInfo[]>(['subscriptions']);
  }

  checkSubscription(): Observable<SubscriptionInfo> {
    return this.getRequest<SubscriptionInfo>(['subscriptions', 'check']);
  }

  cancelSubscription(): Observable<SubscriptionInfo> {
    return this.deleteRequest<SubscriptionInfo>(['subscriptions']);
  }

  resumeSubscription(): Observable<SubscriptionInfo> {
    return this.putRequest<SubscriptionInfo>({}, ['subscriptions', 'resume']);
  }

  // manage company details
  getCompanyDetail(): Observable<PaymentFormValue> {
    return this.getRequest<PaymentFormValue>(['company-details']);
  }

  createCompanyDetail(data: PaymentFormValue): Observable<void> {
    return this.postRequest<void>(data, ['company-details']);
  }

  // manage images
  uploadImage(data: FormData): Observable<Image> {
    return this.postRequest<Image>(data, ['forms', 'upload']).pipe(
      map(
        (res): Image => {
          res.buffer = res.image.type === 'Buffer' ? new Buffer(res.image.data) : null;
          return res;
        }
      )
    );
  }

  getImage(hash: string): Observable<Image> {
    return this.getRequest<Image>(['forms', 'images', hash]).pipe(
      map(
        (res): Image => {
          return res;
        }
      )
    );
  }

  getImages(): Observable<Image[]> {
    return this.getRequest<Image[]>(['images']).pipe(
      map((images): Image[] => {
        return images.map((item) => {
          // item.buffer = item.image.type === 'Buffer' ? new Buffer(item.image.data) : null;
          return item;
        });
      })
    );
  }

  deleteImages(imageHashes: string[]): Observable<void> {
    return this.postRequest<void>({ imageHashes }, ['images', 'delete']);
  }

  // manage registration
  register(email: string, password: string): Observable<void> {
    return this.postRequest<void>({ params: { email, password } }, ['users', 'register']);
  }

  // manage companies
  getOwnCompany(): Observable<Company> {
    return this.getRequest<Company>(['companies']);
  }

  getOwnCompanyLink(): Observable<string> {
    return this.getRequest<{ companyLink: string }>(['companies', 'link']).pipe(
      mergeMap((link) => of(link.companyLink))
    );
  }

  getUsageStatistics(): Observable<Usage> {
    return this.getRequest<Usage>(['companies', 'usage']);
  }

  pollCompanyLinks(companyLink: string): Observable<boolean> {
    return this.getRequest<boolean>(['companies', 'poll', companyLink]);
  }

  setOwnCompanyLink(params: { companyLink: string }): Observable<void> {
    return this.putRequest<void>({ params }, ['companies', 'link']);
  }

  setOwnCompanyName(params: { companyName: string }): Observable<void> {
    return this.putRequest<void>({ params }, ['companies', 'name']);
  }

  // manage forms
  listForms(state?: FormState[]): Observable<FormId[]> {
    return this.getRequest<FormId[]>(['forms'], state ? { 'state[]': state } : {}).pipe(
      mergeMap((forms: FormLink[]) => of(forms.map((form) => Object.assign({}, form, { id: form.link }))))
    );
  }

  createForm(name: string): Observable<Form> {
    return this.postRequest<Form>({ name }, ['forms']);
  }

  copyForm(name: string, data: ConstructionSave | Form): Observable<void> {
    return this.postRequest<void>({ name: name + ' (copy)', data }, ['forms']);
  }

  getForm(company: string, id: string): Observable<Form> {
    return this.getRequest(['forms', company, id]).pipe(
      mergeMap((form: FormLink) => of(formFromJSON(Object.assign(form.data, { name: form.name }))))
    );
  }

  getOwnForm(id: string): Observable<Form> {
    return this.getRequest(['forms', id]).pipe(
      mergeMap((form: FormLink) => of(formFromJSON(Object.assign(form.data, { name: form.name }))))
    );
  }

  getBuilderForm(id: string): Observable<ConstructionSave> {
    return this.getRequest<FormLink>(['forms', id]).pipe(
      mergeMap((form: FormLink) => {
        (form.data as ConstructionSave).form = Object.assign((form.data as ConstructionSave).form, { name: form.name });
        return of(form.data as ConstructionSave);
      })
    );
  }

  renameForm(id: string, name: string): Observable<void> {
    return this.putRequest<void>({ name }, ['forms', id]);
  }

  saveForm(id: string, data: ConstructionSave | Form): Observable<void> {
    return this.putRequest<void>({ data }, ['forms', id]);
  }

  deleteForm(id: string): Observable<void> {
    return this.deleteRequest<void>(['forms', id]);
  }

  archiveForm(id: string): Observable<void> {
    return this.getRequest<void>(['forms', id, 'archive']);
  }

  publishForm(id: string): Observable<void> {
    return this.getRequest<void>(['forms', id, 'publish']);
  }

  // manage answers
  postAnswer(company: string, id: string, token: string, answers: DBAnswers): Observable<void> {
    return this.postRequest<void>({ answer: answers }, ['answers', company, id, token]);
  }

  getAnswers(id: string, filter?: Condition): Observable<DBAnswers[]> {
    // todo: handle startDate and endDate in the request.
    return this.postRequest<DBAnswers[]>({ filter }, ['answers', id]);
  }

  getAnswerCount(id: string): Observable<number> {
    return this.getRequest<number>(['answers', 'count', id]);
  }

  // manage self
  getSelf(): Observable<User> {
    return this.auth.getAccessTokenInfo().pipe(
      mergeMap((jwt) => this.getRequest<User>(['users', String(jwt.userId)]))
    );
  }

  changeOwnPassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.auth.getAccessTokenInfo().pipe(
      mergeMap((jwt) =>
        this.putRequest<void>({ old_password: oldPassword, new_password: newPassword }, [
          'users',
          String(jwt.userId),
          'change_password',
        ])
      )
    );
  }

  // manage users
  getUsers(): Observable<User[]> {
    return this.getRequest<User[]>(['users']);
  }

  getMemberEmails(): Observable<User[]> {
    return this.getRequest<User[]>(['users', 'member-emails']);
  }

  editUser(userId: number, user: User): Observable<void> {
    return this.putRequest<void>({ user }, ['users', String(userId)]);
  }

  deleteUser(userId: number): Observable<void> {
    return this.deleteRequest<void>(['users', String(userId)]);
  }

  createUser(user: User): Observable<User> {
    return this.postRequest<User>({ user }, ['users']);
  }

  resendVerificationEmail(userId: number): Observable<void> {
    return this.postRequest<void>({ userId }, ['users', 'resend-verification']);
  }

  // manage emails and users
  verifyEmail(params: Params): Observable<void> {
    return this.putRequest<void>({ params }, ['users', 'verify']);
  }

  // manage designs
  getDesigns(): Observable<Design[]> {
    return this.getRequest<Design[]>(['formdesigns']);
  }

  createDesign(design: Design): Observable<void> {
    return this.postRequest<void>({ design }, ['formdesigns']);
  }

  deleteDesign(name: string): Observable<void> {
    return this.deleteRequest<void>(['formdesigns', String(name)]);
  }

  editDesign(name: string, design: Design): Observable<void> {
    return this.putRequest<void>({ design }, ['formdesigns', String(name)]);
  }

  // manage postcodeChecker api calls
  getAddress(postalCode: string, houseNumber: string): Observable<Address> {
    return this.postRequest<Address>({ postalCode, houseNumber }, ['postal-code', 'check']);
  }

  // manage filters
  getFilters(fid: string): Observable<Filter[]> {
    return this.getRequest<Filter[]>(['filters', fid]);
  }

  renameFilter(fid: string, id: number, name: string): Observable<void> {
    return this.postRequest<void>({ name }, ['filters', fid, id.toString()]);
  }

  createFilter(fid: string, name: string, data: Condition): Observable<void> {
    return this.postRequest<void>({ name, data }, ['filters', fid, 'create']);
  }

  saveFilter(fid: string, id: number, name: string, data: Condition): Observable<void> {
    return this.putRequest<void>({ name, data }, ['filters', fid, id.toString()]);
  }

  deleteFilter(fid: string, id: number): Observable<void> {
    return this.deleteRequest<void>(['filters', fid, id.toString()]);
  }

  // manage share center
  shareFormLink(fid: string, companyLink: string, shareInfos: ShareInfo[]): Observable<ShareInfo[]> {
    return this.postRequest<ShareInfo[]>({ companyLink, shareInfos }, ['share-center', fid, 'share-link']);
  }

  getShareInfos(fid: string, params: { [param: string]: string | string[] } = {}): Observable<ShareResponse> {
    return this.getRequest<ShareResponse>(['share-center', fid, 'shared-emails'], params);
  }

  getSharedEmailStatics(fid: string): Observable<SharedEmailStatistics> {
    return this.getRequest<SharedEmailStatistics>(['share-center', fid, 'email-statistics']);
  }

  deleteShare(fid: string, id: number): Observable<void> {
    return this.deleteRequest<void>(['share-center', fid, 'share', id.toString()]);
  }

  deleteMultipleShares(fid: string, shareIds: number[]): Observable<void> {
    return this.deleteRequest<void>(['share-center', fid, 'shares'], {
      shareIds: shareIds.map((shareId) => shareId.toString()),
    });
  }

  // request shorthand functions
  getRequest<T>(tokens: string[], params: { [param: string]: string | string[] } = {}): Observable<T> {
    return this.http.get<T>(this.API_ADDR + tokens.join('/'), {
      params: new HttpParams({ fromObject: params }),
    });
  }

  putRequest<T>(body: unknown, tokens: string[], params: { [param: string]: string | string[] } = {}): Observable<T> {
    return this.http.put<T>(this.API_ADDR + tokens.join('/'), body, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  postRequest<T>(body: unknown, tokens: string[], params: { [param: string]: string | string[] } = {}): Observable<T> {
    return this.http.post<T>(this.API_ADDR + tokens.join('/'), body, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  deleteRequest<T>(tokens: string[], params: { [param: string]: string | string[] } = {}): Observable<T> {
    return this.http.delete<T>(this.API_ADDR + tokens.join('/'), {
      params: new HttpParams({ fromObject: params }),
    });
  }
}

export type FormState = 'unpublished' | 'published' | 'archived';

export interface FormId {
  id: string;
  name: string;
  state: FormState;
  responseCount: number;
  valid?: boolean;
}

interface FormLink {
  id: string;
  name: string;
  state: FormState;
  link: string;
  data: Form | ConstructionSave;
  responseCount: number;
}

export interface Answer {
  answer: Primitive;
  date: Date;
  id?: number;
}

export interface Filter {
  id: number;
  data: Condition;
  name: string;
}
