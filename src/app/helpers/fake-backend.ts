import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
 
export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions) {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlZlbmthdGVzaCIsImlhdCI6MTUxNjIzOTAyMiwiYWRtaW4iOmZhbHNlfQ.LUKDNcPzy9bAXy8Ppcz3e7V13_zNPRwoWebyuha91kQ';
    let admin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJhZG1pbiI6dHJ1ZX0.ynUI0srvroRlFnSdfyqxSpovQ97cCyimS7Kwb0UHxIg';

    backend.connections.subscribe((connection: MockConnection) => {
     
      setTimeout(() => {
        //
        // Fake implementation of /api/authenticate
        //
        if (connection.request.url.endsWith('/api/authenticate') && 
            connection.request.method === RequestMethod.Post) {
            let body = JSON.parse(connection.request.getBody());

            if (body.email === 'venkatesh.nikith@gmail.com' && body.password === '1234') {
              connection.mockRespond(new Response(
                new ResponseOptions({ 
                  status: 200, 
                  body: { token: token }
                })
              ));
            } 
            
            else if (body.email === 'admin@gmail.com' && body.password === '1234')
            {
                connection.mockRespond(new Response(
                    new ResponseOptions({ 
                      status: 200, 
                      body: { token: admin_token }
                    })
                  ));
            }
            
            else {
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200 })
              ));
            }
        }
        


        // 
        // Fake implementation of /api/orders
        //
        if (connection.request.url.endsWith('/api/dashboard') && connection.request.method === RequestMethod.Get) {
            if (connection.request.headers.get('Authorization') === 'Bearer ' + token) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: [""] })
                ));
            } else {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 401 })
                ));
            }
        }     
          
        

      }, 1000);
    });
 
    return new Http(backend, options);
}
 
export let fakeBackendProvider = {
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions]
};